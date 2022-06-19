'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Kakao = void 0;
const axios_1 = __importDefault(require('axios'));
class Kakao {
  static async getUser(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    try {
      const response = await axios_1.default.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers,
        },
      );
      const { id, properties, kakao_account: kakaoAccount } = response.data;
      const { nickname, profile_image: profileImage } = properties;
      const { email } = kakaoAccount;
      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error) {
      return undefined;
    }
  }
}
exports.Kakao = Kakao;
