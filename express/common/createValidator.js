'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createValidators =
  exports.createValidator =
  exports.createValidation =
  exports.validatorWrapper =
  exports.validator =
    void 0;
const ValidatorMethod = __importStar(require('express-validator'));
const validator = (req, _, next) => {
  const errors = ValidatorMethod.validationResult(req);
  if (!errors.isEmpty()) {
    next({
      status: 400,
      message: errors
        .array()
        .map(error => `${error.param}: ${error.msg}`)
        .join(', '),
    });
  } else {
    next();
  }
};
exports.validator = validator;
const validatorWrapper = (...props) => [...props, exports.validator];
exports.validatorWrapper = validatorWrapper;
const createValidation = (method, type) => {
  if (type === 'string') {
    method = method.isString();
  } else if (type === 'number') {
    method = method.isNumeric();
  } else if (type === 'boolean') {
    method = method.isBoolean();
  } else if (type === 'array' || type === 'none') {
    method = method.custom(_ => true);
  } else if (type === 'object') {
    method = method.isObject();
  }
  return method;
};
exports.createValidation = createValidation;
const createValidator = (key, api) => {
  let method = ValidatorMethod[key](api.key);
  if (api.default) {
    method = method.optional({ nullable: true }).default(api.default);
  } else if (api.nullable) {
    method = method.optional({ nullable: true });
  }
  if (!Array.isArray(api.type)) {
    method = (0, exports.createValidation)(method, api.type);
  } else {
    api.type.forEach(type => {
      method = (0, exports.createValidation)(method, type);
    });
  }
  return method;
};
exports.createValidator = createValidator;
const createValidators = controllers => {
  const validators = {};
  Object.entries(controllers).forEach(([key, value]) => {
    if (key.indexOf('API') > -1) {
      const validatorName = key.replace('API', '');
      const validator = [];
      Object.entries(value).forEach(valueItem => {
        const [controllerKey, apis] = valueItem;
        if (
          controllerKey === 'param' ||
          controllerKey === 'query' ||
          controllerKey === 'header' ||
          controllerKey === 'body'
        ) {
          apis.forEach(api => {
            validator.push((0, exports.createValidator)(controllerKey, api));
          });
        }
      });
      validators[validatorName] = (0, exports.validatorWrapper)(...validator);
    }
  });
  return validators;
};
exports.createValidators = createValidators;
