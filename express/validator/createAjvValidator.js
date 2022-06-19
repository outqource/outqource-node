'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const createAjvMiddleware_1 = __importDefault(require('./createAjvMiddleware'));
const createAjvValidator = controllers => {
  const validators = {};
  Object.entries(controllers).forEach(([key, value]) => {
    if (key.includes('API')) {
      const validatorName = key.replace('API', '');
      if (value.ajv) {
        const ajv = {};
        Object.entries(value.ajv).forEach(([key, value]) => {
          const validator = {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false,
          };
          value.forEach(item => {
            if (item.type === 'string' || item.type === 'number' || item.type === 'boolean') {
              validator.properties[item.key] = { type: item.type };
            }
            if (!item.nullable) {
              validator.required.push(item.key);
            }
          });
          ajv[key] = validator;
        });
        const middleware = (0, createAjvMiddleware_1.default)(ajv);
        validators[validatorName] = [middleware];
      }
    }
  });
  return validators;
};
exports.default = createAjvValidator;
