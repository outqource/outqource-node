'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Google = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const axios_1 = __importDefault(require('axios'));
const constant_1 = require('./constant');
class Google {
  constructor(props) {
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.redirectUri = props.redirectUri;
  }
  getRest(res, redirectUri) {
    if (!this.redirectUri && !redirectUri) {
      throw { status: 500, message: 'Google Redirect Url is not defined' };
    }
    res.redirect(
      constant_1.GOOGLE_URL.AUTH(
        this.clientId,
        redirectUri !== null && redirectUri !== void 0 ? redirectUri : this.redirectUri,
      ),
    );
  }
  async getToken(code) {
    var _a;
    if (this.clientSecret || this.redirectUri)
      throw { status: 500, message: 'Google Client Secret or Redirect Url is not defined' };
    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      code,
    };
    try {
      const response = await axios_1.default.post(constant_1.GOOGLE_URL.TOKEN, data);
      return (_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token;
    } catch (error) {
      return undefined;
    }
  }
  static async getAppUser(token) {
    try {
      const response = await axios_1.default.get(constant_1.GOOGLE_URL.USER_APP(token));
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
  static async getWebUser(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios_1.default.get(constant_1.GOOGLE_URL.USER_WEB, { headers });
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
  async getRestCallback(code) {
    try {
      const user = await Google.getWebUser(code);
      if (!user) {
        throw { status: 500, message: '구글 유저정보 발급 오류!' };
      }
      return { token: code, user };
    } catch (error) {
      return undefined;
    }
  }
}
exports.Google = Google;
