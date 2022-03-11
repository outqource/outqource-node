import type {
  OpenAPIOptions,
  ControllerAPI,
  ControllerAPIResponsStatusCode,
  ControllerAPIResponse,
  OpenAPI3,
} from "./types";

import { OPEN_API_RESPONSES } from "./constant";

interface IgetOpenAPI extends OpenAPIOptions {
  tags: any[];
  paths: any;
}

const getOpenAPIPath = (api: ControllerAPI) => {
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

const getOpenAPIPathSummary = (api: ControllerAPI, name: string) => {
  return api.summary ? `${api.summary} [${name}]` : `function ${name}`;
};

const getOpenAPIPathSecurity = (api: ControllerAPI) => {
  const security = [];
  if (api.auth) {
    if (api.auth === "jwt") security.push({ bearerAuth: [] });
  }

  return security;
};

const getOpenAPIPathParameters = (api: ControllerAPI) => {
  const parameters: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema: {
      type: string;
    };
  }> = [];

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

const getOpenAPIPathRequestBody = (api: ControllerAPI) => {
  if (api.method === "GET") return null;

  if (api.formData) {
    const type = api.formData.key === "multiple" ? "array" : "object";
    let formDataProperties: any = {};

    if (type === "array") {
      formDataProperties = {
        type: "array",
        items: { format: "binary", type: "string" },
      };
    } else {
      formDataProperties = {
        type: "string",
        format: "binary",
      };
    }

    const otherProperties: Record<string, any> = {};
    if (Array.isArray(api.body)) {
      api.body.forEach((item) => {
        otherProperties[item.key] = {
          type: item.type,
          example:
            item.example ||
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
            properties: {
              [api.formData.key]: formDataProperties,
              ...otherProperties,
            },
          },
        },
      },
    };
  } else {
    const example: Record<string, any> = {};
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

const getOpenAPIPathResponses = (api: ControllerAPI) => {
  const responses: any = {
    500: {
      description: OPEN_API_RESPONSES[500],
      content: {
        "application/json": {},
      },
    },
  };

  if (Array.isArray(api.responses)) {
    api.responses.forEach((item: ControllerAPIResponse) => {
      if (typeof item === "number") {
        const statusCode = item as ControllerAPIResponsStatusCode;
        responses[statusCode] = {
          description: OPEN_API_RESPONSES[statusCode] as string,
          content: {
            "application/json": {},
          },
        };
      } else {
        const { status, message, example = {} } = item;
        responses[status] = {
          description: message,
          content: {
            "application/json": example,
          },
        };
      }
    });
  } else {
    responses[200] = {
      description: OPEN_API_RESPONSES[200],
      content: {
        "application/json": {},
      },
    };
  }

  return responses;
};

const getOpenAPI = ({
  title,
  version,
  urls,
  tags,
  paths,
}: IgetOpenAPI): OpenAPI3 => ({
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

const getOpenAPITags = (controllers: any): Array<{ name: string }> => {
  const tags: string[] = [];

  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf("API") > -1) {
      const api = value as ControllerAPI;
      if (Array.isArray(api.tags)) {
        tags.push(...value.tags);
      }
    }
  });

  return tags
    .filter((item, index) => tags.indexOf(item) === index)
    .map((tag: string) => ({ name: tag }))
    .sort((tag1, tag2) =>
      tag1.name.toUpperCase().localeCompare(tag2.name.toUpperCase())
    );
};

const getOpenAPIPaths = (controllers: Record<string, any>) => {
  const paths: any = {};
  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf("API") > -1) {
      const api = value as ControllerAPI;
      const name = key.replace("API", "");

      const path = getOpenAPIPath(api);
      const summary = getOpenAPIPathSummary(api, name);
      const security = getOpenAPIPathSecurity(api);
      const parameters = getOpenAPIPathParameters(api);
      const requestBody = getOpenAPIPathRequestBody(api);
      const responses = getOpenAPIPathResponses(api);

      paths[path] = {
        ...paths[path],
        [api.method.toLowerCase()]: {
          tags: api.tags || [],
          summary,
          security,
          parameters,
          responses,
          requestBody,
        },
      };
    }
  });

  return paths;
};

export const createOpenAPI = async (
  { title, version, urls }: OpenAPIOptions,
  controllers: any
): Promise<string> => {
  const tags = getOpenAPITags(controllers);
  const paths = getOpenAPIPaths(controllers);
  const result = getOpenAPI({ title, version, urls, tags, paths });

  return JSON.stringify(result);
};
