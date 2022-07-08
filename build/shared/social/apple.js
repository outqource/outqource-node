'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Apple = void 0;
const apple_auth_1 = __importDefault(require('apple-auth'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
class Apple {
  constructor(props) {
    this.appleAuth = new apple_auth_1.default(props.appleConfig, props.path, 'text');
  }
  getRest(res) {
    res.redirect(this.appleAuth.loginURL());
  }
  static async getUser(id_token) {
    try {
      const idToken = jsonwebtoken_1.default.decode(id_token);
      if (!(idToken === null || idToken === void 0 ? void 0 : idToken.sub)) return undefined;
      return {
        id: idToken.sub,
        email: idToken.email,
      };
    } catch (error) {
      return undefined;
    }
  }
  async getRestCallback(code) {
    try {
      const user = await Apple.getUser(code);
      if (!user) throw { status: 500, message: '애플 유저 정보 발급 오류!' };
      return user;
    } catch (err) {
      return undefined;
    }
  }
}
exports.Apple = Apple;
