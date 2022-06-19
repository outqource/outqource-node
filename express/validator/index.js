'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createAjvValidator = exports.Ajv = void 0;
const ajv_1 = __importDefault(require('ajv'));
exports.Ajv = ajv_1.default;
const createAjvValidator_1 = __importDefault(require('./createAjvValidator'));
exports.createAjvValidator = createAjvValidator_1.default;
