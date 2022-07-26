'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Naver = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const axios_1 = __importDefault(require('axios'));
const constant_1 = require('./constant');
class Naver {
  constructor(props) {
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.redirectUrl = props.redirectUrl;
  }
  getRest(res, code, redirectUrl) {
    if (!this.redirectUrl && !redirectUrl) throw { status: 500, message: 'Naver Redirect Url is not defined' };
    res.redirect(
      constant_1.NAVER_URL.AUTH(
        code,
        redirectUrl !== null && redirectUrl !== void 0 ? redirectUrl : this.redirectUrl,
        this.clientId,
      ),
    );
  }
  static async getUser(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    try {
      const response = await axios_1.default.get(constant_1.NAVER_URL.USER, { headers });
      const { response: naverResponse } = response.data;
      const { id, email, gender, age, mobile: phoneNumber } = naverResponse;
      return {
        id,
        email,
        gender,
        age,
        phoneNumber,
      };
    } catch (err) {
      return undefined;
    }
  }
  async getToken(code) {
    try {
      if (!this.clientSecret) throw { status: 500, message: 'Naver Client Secret is not defined' };
      const response = await axios_1.default.get(constant_1.NAVER_URL.TOKEN(code, this.clientId, this.clientSecret));
      const { access_token: token, token_type: tokenType } = response.data;
      return { token, tokenType };
    } catch (err) {
      return undefined;
    }
  }
  async getRestCallback(code) {
    try {
      const tokenInfo = await this.getToken(code);
      if (!tokenInfo) {
        throw { status: 400, message: '네이버 토큰 발급 오류!' };
      }
      const user = await Naver.getUser(tokenInfo.token);
      if (!user) {
        throw { status: 500, message: '네이버 유저정보 발급 오류!' };
      }
      return { ...tokenInfo, user };
    } catch (error) {
      return undefined;
    }
  }
}
exports.Naver = Naver;
