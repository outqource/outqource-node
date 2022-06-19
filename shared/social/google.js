'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Google = void 0;
const axios_1 = __importDefault(require('axios'));
class Google {
  static async getUser(token) {
    try {
      const response = await axios_1.default.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      const { id, email, name: nickname, picture: profileImage } = response.data;
      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error) {
      const { response } = error;
      if (response.data.error === 'invalid_token') throw { status: 403, message: 'GOOGLE_TOKEN_EXPIRED' };
      return undefined;
    }
  }
}
exports.Google = Google;
