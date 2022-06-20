'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Ajv = void 0;
const ajv_1 = __importDefault(require('ajv'));
exports.Ajv = ajv_1.default;
class Validator {
  constructor(controllers) {
    this.controllers = {};
    this.validators = {};
    this.middlewares = {};
    this.controllers = controllers;
  }
  static create(controllers) {
    const instance = new Validator(controllers);
    return instance._create();
  }
  _create() {
    Object.entries(this.controllers).forEach(([key, value]) => {
      if (key.includes('API')) {
        const name = key.replace('API', '');
        const apiValidators = {};
        Object.entries(value).forEach(([key, value]) => {
          if (key === 'param' || key === 'query' || key === 'body') {
            const validator = this.createValidators(value);
            apiValidators[key] = validator;
          }
        });
        const middlewares = this.createMiddleware(apiValidators);
        this.middlewares[name] = [middlewares];
      }
    });
    return this.middlewares;
  }
  createValidators(validatorItems) {
    const validator = {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    };
    validatorItems.forEach(validatorItem => {
      const { key, type } = validatorItem;
      if (type === 'string' || type === 'number' || type === 'boolean') {
        validator.properties[key] = { type };
      }
      if (validatorItem.type === 'array' && validatorItem.items) {
        validator.properties[key] = {
          type,
          items: this.createChildValidators(validatorItem.items),
        };
      }
      if (!validatorItem.nullable) {
        validator.required.push(key);
      }
    });
    return validator;
  }
  createChildValidators(validatorItems) {
    if (typeof validatorItems === 'string') {
      if (validatorItems === 'string' || validatorItems === 'number' || validatorItems === 'boolean') {
        return { type: validatorItems };
      }
    }
    if (Array.isArray(validatorItems)) {
      const validator = {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      };
      validatorItems.forEach(validatorItem => {
        const { key, type } = validatorItem;
        if (type === 'string' || type === 'number' || type === 'boolean') {
          validator.properties[key] = { type };
        }
        if (validatorItem.type === 'array' && validatorItem.items) {
          validator.properties[key] = {
            type,
            items: this.createChildValidators(validatorItem.items),
          };
        }
        if (!validatorItem.nullable) {
          validator.required.push(key);
        }
      });
      return validator;
    }
    return {};
  }
  createMiddleware(props) {
    if (!props) props = {};
    const ajv = (() => {
      const options = {};
      if (props.param) options.coerceTypes = true;
      return new ajv_1.default(options);
    })();
    const validators = {};
    if (props.param) {
      validators.param = ajv.compile(props.param);
    }
    if (props.query) {
      validators.query = ajv.compile(props.query);
    }
    if (props.body) {
      validators.body = ajv.compile(props.body);
    }
    return (req, res, next) => {
      var _a, _b, _c;
      let errorMessage = '';
      if (req.params && validators.param) {
        const validation = validators.param(req.params);
        errorMessage = (_a = this.getErrorMessage(validators.param.errors)) !== null && _a !== void 0 ? _a : '';
        if (!validation) {
          return next({
            status: 400,
            message: `Request url parameters validation failed: ${errorMessage}`,
          });
        }
      }
      if (req.query && validators.query) {
        const validation = validators.query(req.query);
        errorMessage = (_b = this.getErrorMessage(validators.query.errors)) !== null && _b !== void 0 ? _b : '';
        if (!validation) {
          return next({
            status: 400,
            message: `Request query parameters validation failed: ${errorMessage}`,
          });
        }
      }
      if (req.body && validators.body) {
        const validation = validators.body(req.body);
        errorMessage = (_c = this.getErrorMessage(validators.body.errors)) !== null && _c !== void 0 ? _c : '';
        if (!validation) {
          return next({
            status: 400,
            message: `Request body validation failed: ${errorMessage}`,
          });
        }
      }
      next();
    };
  }
  getErrorMessage(errors) {
    var _a;
    if (!errors) return undefined;
    return (_a =
      errors === null || errors === void 0
        ? void 0
        : errors.map(error => `${error.instancePath.replace('/', '')} - ${error.message}`).join(', ')) !== null &&
      _a !== void 0
      ? _a
      : '';
  }
}
exports.default = Validator;
