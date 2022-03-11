"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenAPI = void 0;
const constant_1 = require("./constant");
const getOpenAPIPath = (api) => {
    const path = api.path
        .split("/")
        .map((pathItem) => {
        if (pathItem.indexOf(":") > -1) {
            return `{${pathItem.replace(":", "")}}`;
        }
        return pathItem;
    })
        .join("/");
    return path;
};
const getOpenAPIPathSummary = (api, name) => {
    return api.summary ? `${api.summary} [${name}]` : `function ${name}`;
};
const getOpenAPIPathSecurity = (api) => {
    const security = [];
    if (api.auth) {
        if (api.auth === "jwt")
            security.push({ bearerAuth: [] });
    }
    return security;
};
const getOpenAPIPathParameters = (api) => {
    const parameters = [];
    if (Array.isArray(api.param)) {
        api.param.forEach((item) => {
            parameters.push({
                name: item.key,
                in: "path",
                required: !item.nullable && !item.default,
                description: item.example || item.default || item.key,
                schema: {
                    type: Array.isArray(item.type) ? item.type[0] : item.type,
                },
            });
        });
    }
    if (Array.isArray(api.query)) {
        api.query.forEach((item) => {
            parameters.push({
                name: item.key,
                in: "query",
                required: !item.nullable && !item.default,
                description: item.example || item.default || item.key,
                schema: {
                    type: Array.isArray(item.type) ? item.type[0] : item.type,
                },
            });
        });
    }
    return parameters;
};
const getOpenAPIPathRequestBody = (api) => {
    if (api.method === "GET")
        return null;
    if (api.formData) {
        const type = api.formData.key === "multiple" ? "array" : "object";
        let formDataProperties = {};
        if (type === "array") {
            formDataProperties = {
                type: "array",
                items: { format: "binary", type: "string" },
            };
        }
        else {
            formDataProperties = {
                type: "string",
                format: "binary",
            };
        }
        const otherProperties = {};
        if (Array.isArray(api.body)) {
            api.body.forEach((item) => {
                otherProperties[item.key] = {
                    type: item.type,
                    example: item.example ||
                        item.default ||
                        (Array.isArray(item.type) ? item.type[0] : item.type),
                };
            });
        }
        return {
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: Object.assign({ [api.formData.key]: formDataProperties }, otherProperties),
                    },
                },
            },
        };
    }
    else {
        const example = {};
        if (Array.isArray(api.body)) {
            api.body.forEach((item) => {
                example[item.key] =
                    item.example ||
                        item.default ||
                        (Array.isArray(item.type) ? item.type[0] : item.type);
            });
        }
        const requestBody = {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        example,
                    },
                },
            },
        };
        return requestBody;
    }
};
const getOpenAPIPathResponses = (api) => {
    const responses = {
        500: {
            description: constant_1.OPEN_API_RESPONSES[500],
            content: {
                "application/json": {},
            },
        },
    };
    if (Array.isArray(api.responses)) {
        api.responses.forEach((item) => {
            if (typeof item === "number") {
                const statusCode = item;
                responses[statusCode] = {
                    description: constant_1.OPEN_API_RESPONSES[statusCode],
                    content: {
                        "application/json": {},
                    },
                };
            }
            else {
                const { status, message = constant_1.OPEN_API_RESPONSES[item.status], exampleContentType = "application/json", example = {}, } = item;
                const content = { [exampleContentType]: {} };
                if (example) {
                    content[exampleContentType].example = example;
                }
                responses[status] = {
                    description: message,
                    content,
                };
            }
        });
    }
    else {
        responses[200] = {
            description: constant_1.OPEN_API_RESPONSES[200],
            content: {
                "application/json": {},
            },
        };
    }
    return responses;
};
const getOpenAPI = ({ title, version, urls, tags, paths, }) => ({
    openapi: "3.0.0",
    info: {
        title,
        version,
    },
    servers: urls.map((url) => ({ url })),
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
    tags,
    paths,
});
const getOpenAPITags = (controllers) => {
    const tags = [];
    Object.entries(controllers).forEach(([key, value]) => {
        if (key.indexOf("API") > -1) {
            const api = value;
            if (Array.isArray(api.tags)) {
                tags.push(...value.tags);
            }
        }
    });
    return tags
        .filter((item, index) => tags.indexOf(item) === index)
        .map((tag) => ({ name: tag }))
        .sort((tag1, tag2) => tag1.name.toUpperCase().localeCompare(tag2.name.toUpperCase()));
};
const getOpenAPIPaths = (controllers) => {
    const paths = {};
    Object.entries(controllers).forEach(([key, value]) => {
        if (key.indexOf("API") > -1) {
            const api = value;
            const name = key.replace("API", "");
            const path = getOpenAPIPath(api);
            const summary = getOpenAPIPathSummary(api, name);
            const security = getOpenAPIPathSecurity(api);
            const parameters = getOpenAPIPathParameters(api);
            const requestBody = getOpenAPIPathRequestBody(api);
            const responses = getOpenAPIPathResponses(api);
            paths[path] = Object.assign(Object.assign({}, paths[path]), { [api.method.toLowerCase()]: {
                    tags: api.tags || [],
                    summary,
                    security,
                    parameters,
                    responses,
                    requestBody,
                } });
        }
    });
    return paths;
};
const createOpenAPI = ({ title, version, urls }, controllers) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = getOpenAPITags(controllers);
    const paths = getOpenAPIPaths(controllers);
    const result = getOpenAPI({ title, version, urls, tags, paths });
    return JSON.stringify(result);
});
exports.createOpenAPI = createOpenAPI;
