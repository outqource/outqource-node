'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const ajv_1 = __importDefault(require('ajv'));
const createAjvMiddleware = props => {
  if (!props) props = {};
  const ajv = (() => {
    const options = {};
    if (props.params) options.coerceTypes = true;
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
    var _a, _b, _c, _d, _e, _f;
    let errorMessage = '';
    if (req.params && validators.params) {
      const validation = validators.params(req.params);
      errorMessage =
        (_b =
          (_a = validators.params.errors) === null || _a === void 0
            ? void 0
            : _a.map(error => error.message).join(', ')) !== null && _b !== void 0
          ? _b
          : '';
      if (!validation) {
        return next({
          status: 400,
          message: `Request url parameters validation failed: ${errorMessage}`,
        });
      }
    }
    if (req.query && validators.query) {
      const validation = validators.query(req.query);
      errorMessage =
        (_d =
          (_c = validators.query.errors) === null || _c === void 0
            ? void 0
            : _c.map(error => error.message).join(', ')) !== null && _d !== void 0
          ? _d
          : '';
      if (!validation) {
        return next({
          status: 400,
          message: `Request query parameters validation failed: ${errorMessage}`,
        });
      }
    }
    if (req.body && validators.body) {
      const validation = validators.body(req.body);
      errorMessage =
        (_f =
          (_e = validators.body.errors) === null || _e === void 0
            ? void 0
            : _e.map(error => error.message).join(', ')) !== null && _f !== void 0
          ? _f
          : '';
      if (!validation) {
        return next({
          status: 400,
          message: `Request body validation failed: ${errorMessage}`,
        });
      }
    }
    next();
  };
};
exports.default = createAjvMiddleware;
