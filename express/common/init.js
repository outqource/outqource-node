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
    urls: ["localhost:8000"],
};
class InitApp {
    constructor(openAPIOptions) {
        this.app = (0, express_1.default)();
        this.openAPIOptions = openAPIOptions !== null && openAPIOptions !== void 0 ? openAPIOptions : defaultOpenAPIOptions;
    }
    init({ controllers, openAPIPath, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const openAPI = yield (0, shared_1.createOpenAPI)(this.openAPIOptions, controllers);
            yield fs_1.default.writeFileSync(openAPIPath, openAPI);
        });
    }
    middlewares({ corsOptions, jwtUserCallback, swaggerConfigPath, swaggerEndpoint, }, middlewares) {
        this.app.use((0, middlewares_1.json)());
        this.app.use((0, middlewares_1.urlencoded)({ extended: true }));
        this.app.use(express_1.default.static("public"));
        this.app.use((0, middlewares_1.cors)(corsOptions));
        this.app.use((0, middlewares_1.jsonwebtoken)(jwtUserCallback));
        this.app.use((0, middlewares_1.pagination)());
        if (swaggerConfigPath) {
            this.app.use(swaggerEndpoint || "/api-docs", ...(0, middlewares_1.swagger)(swaggerConfigPath));
        }
        if (middlewares) {
            middlewares.forEach((middleware) => {
                this.app.use(middleware);
            });
        }
    }
    routers(controllers, options) {
        const validators = (0, _1.createValidators)(controllers);
        (0, _1.createRouter)(this.app, controllers, validators);
        this.app.use((0, _1.createErrorController)(options === null || options === void 0 ? void 0 : options.errorOptions));
        this.app.use((0, _1.createGlobalController)(options === null || options === void 0 ? void 0 : options.globalOptions));
    }
}
exports.InitApp = InitApp;
