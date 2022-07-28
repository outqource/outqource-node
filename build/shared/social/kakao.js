'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Kakao = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const axios_1 = __importDefault(require('axios'));
const query_string_1 = __importDefault(require('query-string'));
const constant_1 = require('./constant');
class Kakao {
  constructor(props) {
    this.redirectUrl = props.kakaoRedirectUrl;
    this.restKey = props.kakaoRestKey;
    this.secretKey = props.kakaoSecretKey;
    this.adminKey = props.kakaoAdminKey;
  }
  getRest(res, redirectUrl) {
    if (!this.redirectUrl && !redirectUrl) {
      throw { status: 500, message: 'Kakao Redirect Url is not defined' };
    }
    res.redirect(
      constant_1.KAKAO_URL.AUTH(
        this.restKey,
        redirectUrl !== null && redirectUrl !== void 0 ? redirectUrl : this.redirectUrl,
      ),
    );
  }
  static async getUser(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    try {
      const response = await axios_1.default.get(constant_1.KAKAO_URL.USER, {
        headers,
      });
      const { id, properties, kakao_account: kakaoAccount } = response.data;
      return {
        id,
        kakaoAccount,
        properties,
      };
    } catch (error) {
      return undefined;
    }
  }
  async getToken(code, redirectUrl) {
    var _a;
    const data = query_string_1.default.stringify({
      grant_type: 'authorization_code',
      client_id: this.restKey,
      client_secret: this.secretKey,
      redirectUri: redirectUrl || this.redirectUrl,
      code,
    });
    try {
      const response = await axios_1.default.post(constant_1.KAKAO_URL.TOKEN, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const token = (_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token;
      return token;
    } catch (error) {
      return undefined;
    }
  }
  async getRestCallback(code) {
    try {
      const token = await this.getToken(code);
      if (!token) {
        throw { status: 400, message: '카카오 토큰 발급 오류!' };
      }
      const user = await Kakao.getUser(token);
      if (!user) {
        throw { status: 500, message: '카카오 유저정보 발급 오류!' };
      }
      return { token, user };
    } catch (error) {
      return undefined;
    }
  }
  async logout(id, adminKey) {
    try {
      if (!adminKey && !this.adminKey) {
        throw { status: 500, message: '카카오 어드민키가 없습니다.' };
      }
      const headers = {
        Authorization: `KakaoAK ${adminKey !== null && adminKey !== void 0 ? adminKey : this.adminKey}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      };
      const data = query_string_1.default.stringify({
        target_id_type: 'user_id',
        target_id: id,
      });
      await axios_1.default.post(constant_1.KAKAO_URL.LOGOUT, data, { headers });
      return true;
    } catch (err) {
      return false;
    }
  }
}
exports.Kakao = Kakao;
