'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Jsonwebtoken = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
class Jsonwebtoken {
  constructor(jwtKey, props) {
    this.jwtKey = jwtKey;
    this.signOptions = props === null || props === void 0 ? void 0 : props.signOptions;
    this.verifyOptions = props === null || props === void 0 ? void 0 : props.verifyOptions;
  }
  signJwt(value, options) {
    try {
      if (typeof value !== 'string' && typeof value !== 'object' && !Buffer.isBuffer(value)) {
        throw { status: 400, message: 'BadRequest Payload' };
      }
      return jsonwebtoken_1.default.sign(value, this.jwtKey, options || this.signOptions);
    } catch (error) {
      return error;
    }
  }
  verifyJwt(token, options) {
    try {
      return jsonwebtoken_1.default.verify(token, this.jwtKey, options || this.verifyOptions);
    } catch (error) {
      return error;
    }
  }
}
exports.Jsonwebtoken = Jsonwebtoken;
