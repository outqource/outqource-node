'use strict';
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _Validator_instances, _a, _Validator_parse, _Validator_create;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Ajv = void 0;
const ajv_1 = __importDefault(require('ajv'));
exports.Ajv = ajv_1.default;
class Validator {
  constructor(controllers) {
    _Validator_instances.add(this);
    this.controllers = {};
    this.validators = {};
    this.middlewares = {};
    this.controllers = controllers;
  }
  static create(controllers) {
    console.log(`validator create`, controllers);
    const instance = new Validator(controllers);
    return __classPrivateFieldGet(instance, _Validator_instances, 'm', _Validator_create).call(instance);
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
  createMiddleware(props, controllerAPI) {
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
      var _b, _c, _d, _e, _f, _g;
      let errorMessage = '';
      if (req.params && validators.param) {
        const validation = validators.param(
          __classPrivateFieldGet(Validator, _a, 'm', _Validator_parse).call(
            Validator,
            req.params,
            (_b = controllerAPI.param) !== null && _b !== void 0 ? _b : [],
          ),
        );
        errorMessage = (_c = this.getErrorMessage(validators.param.errors)) !== null && _c !== void 0 ? _c : '';
        if (!validation) {
          return next({
            status: 400,
            message: `Request url parameters validation failed: ${errorMessage}`,
          });
        }
      }
      if (req.query && validators.query) {
        const validation = validators.query(
          __classPrivateFieldGet(Validator, _a, 'm', _Validator_parse).call(
            Validator,
            req.query,
            (_d = controllerAPI.query) !== null && _d !== void 0 ? _d : [],
          ),
        );
        errorMessage = (_e = this.getErrorMessage(validators.query.errors)) !== null && _e !== void 0 ? _e : '';
        if (!validation) {
          return next({
            status: 400,
            message: `Request query parameters validation failed: ${errorMessage}`,
          });
        }
      }
      if (req.body && validators.body) {
        const validation = validators.body(
          __classPrivateFieldGet(Validator, _a, 'm', _Validator_parse).call(
            Validator,
            req.body,
            (_f = controllerAPI.body) !== null && _f !== void 0 ? _f : [],
          ),
        );
        errorMessage = (_g = this.getErrorMessage(validators.body.errors)) !== null && _g !== void 0 ? _g : '';
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
    var _b;
    if (!errors) return undefined;
    return (_b =
      errors === null || errors === void 0
        ? void 0
        : errors.map(error => `${error.instancePath.replace('/', '')} - ${error.message}`).join(', ')) !== null &&
      _b !== void 0
      ? _b
      : '';
  }
}
exports.default = Validator;
(_a = Validator),
  (_Validator_instances = new WeakSet()),
  (_Validator_parse = function _Validator_parse(object, validatorItems) {
    const newObject = { ...object };
    validatorItems.forEach(validatorItem => {
      const { key, type } = validatorItem;
      const value = newObject[key];
      if (value) {
        if (type === 'number') {
          newObject[key] = Number(newObject[key]);
        } else if (type === 'boolean' && (value === 'true' || value === 'false')) {
          newObject[key] = value === 'true';
        }
      }
    });
    return newObject;
  }),
  (_Validator_create = function _Validator_create() {
    Object.entries(this.controllers).forEach(([key, value]) => {
      if (key.includes('API')) {
        const name = key.replace('API', '');
        const apiValidators = {};
        const controllerAPI = value;
        Object.entries(value).forEach(([key, value]) => {
          if (key === 'param' || key === 'query' || key === 'body') {
            apiValidators[key] = this.createValidators(value);
          }
        });
        const middlewares = this.createMiddleware(apiValidators, controllerAPI);
        this.middlewares[name] = [middlewares];
      }
    });
    return this.middlewares;
  });
