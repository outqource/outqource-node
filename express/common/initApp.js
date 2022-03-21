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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitApp = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const shared_1 = require("../../shared");
const middlewares_1 = require("../middlewares");
const _1 = require(".");
const defaultOpenAPIOptions = {
    title: "outqource-node/express",
    version: "1.0.0",
    urls: ["http://localhost:8000"],
};
class InitApp {
    constructor(props) {
        var _a, _b, _c;
        this.app = (0, express_1.default)();
        this.controllers = props === null || props === void 0 ? void 0 : props.controllers;
        if ((_a = props.openAPI) === null || _a === void 0 ? void 0 : _a.path) {
            this.openAPI = {
                path: props.openAPI.path,
                options: ((_b = props.openAPI) === null || _b === void 0 ? void 0 : _b.options) || defaultOpenAPIOptions,
                endPoint: ((_c = props.openAPI) === null || _c === void 0 ? void 0 : _c.endPoint) || "/api-docs",
            };
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.openAPI) {
                const openAPI = yield (0, shared_1.createOpenAPI)(this.openAPI.options, this.controllers);
                yield fs_1.default.writeFileSync(this.openAPI.path, openAPI);
            }
        });
    }
    applyMiddlewares(middlewares) {
        if (!middlewares ||
            !Array.isArray(middlewares) ||
            middlewares.length === 0) {
            return;
        }
        middlewares.forEach((middleware) => {
            this.app.use(middleware);
        });
    }
    middlewares(middlewares, props) {
        const corsOptions = props === null || props === void 0 ? void 0 : props.corsOptions;
        const jwtUserCallback = props === null || props === void 0 ? void 0 : props.jwtUserCallback;
        // default
        this.app.use((0, middlewares_1.json)());
        this.app.use((0, middlewares_1.urlencoded)({ extended: true }));
        this.app.use(express_1.default.static("public"));
        this.app.use((0, middlewares_1.cors)(corsOptions));
        this.app.use((0, middlewares_1.pagination)());
        if (!Array.isArray(middlewares) && (middlewares === null || middlewares === void 0 ? void 0 : middlewares.before)) {
            this.applyMiddlewares(middlewares.before);
        }
        if (jwtUserCallback) {
            this.app.use((0, middlewares_1.jsonwebtoken)(jwtUserCallback));
        }
        if (this.openAPI) {
            this.app.use(this.openAPI.endPoint, ...(0, middlewares_1.swagger)(this.openAPI.path));
        }
        if (Array.isArray(middlewares)) {
            this.applyMiddlewares(middlewares);
        }
        if (!Array.isArray(middlewares) && (middlewares === null || middlewares === void 0 ? void 0 : middlewares.after)) {
            this.applyMiddlewares(middlewares.after);
        }
    }
    routers(options) {
        const validators = (0, _1.createValidators)(this.controllers);
        (0, _1.createRouter)(this.app, this.controllers, validators);
        this.app.use((0, _1.createErrorController)(options === null || options === void 0 ? void 0 : options.errorOptions));
        this.app.use((0, _1.createGlobalController)(options === null || options === void 0 ? void 0 : options.globalOptions));
    }
}
exports.InitApp = InitApp;
