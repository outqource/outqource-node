"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const createAjvMiddleware = (props) => {
    if (!props)
        props = {};
    const ajv = (() => {
        const options = {};
        if (props.params)
            options.coerceTypes = true;
        return new ajv_1.default(options);
    })();
    const validators = {};
    if (props.params) {
        validators.params = ajv.compile(props.params);
    }
    if (props.query) {
        validators.query = ajv.compile(props.query);
    }
    if (props.body) {
        validators.body = ajv.compile(props.body);
    }
    return (req, res, next) => {
        if (req.params && validators.params) {
            const validation = ajv.validate(validators.params, req.params);
            if (!validation) {
                return next({
                    status: 400,
                    message: `Request url parameters validation failed: ${ajv.errorsText()}`,
                });
            }
        }
        if (req.query && validators.query) {
            const validation = ajv.validate(validators.query, req.query);
            if (!validation) {
                return next({
                    status: 400,
                    message: `Request query parameters validation failed: ${ajv.errorsText()}`,
                });
            }
        }
        if (req.body && validators.body) {
            const validation = ajv.validate(validators.body, req.body);
            if (!validation) {
                return next({
                    status: 400,
                    message: `Request body validation failed: ${ajv.errorsText()}`,
                });
            }
        }
        next();
    };
};
exports.default = createAjvMiddleware;
