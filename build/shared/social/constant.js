'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.NAVER_URL = exports.APPLE_URL = exports.GOOGLE_URL = exports.KAKAO_URL = void 0;
const query_string_1 = __importDefault(require('query-string'));
const apple_auth_1 = __importDefault(require('apple-auth'));
const KAKAO_URL = {
  TOKEN: 'https://kauth.kakao.com/oauth/token',
  USER: 'https://kapi.kakao.com/v2/user/me',
  LOGOUT: 'https://kapi.kakao.com/v1/user/logout',
  AUTH(restKey, redirectUrl) {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${restKey}&redirect_uri=${redirectUrl}&response_type=code`;
  },
};
exports.KAKAO_URL = KAKAO_URL;
const GOOGLE_URL = {
  TOKEN: 'https://oauth2.googleapis.com/token',
  USER_WEB: 'https://www.googleapis.com/oauth2/v2/userinfo',
  USER_APP(id_token) {
    return 'https://oauth2.googleapis.com/tokeninfo?id_token=' + id_token;
  },
  AUTH(client_id, redirect_uri) {
    const GOOGLE_AUTH_URL_PARAMS = query_string_1.default.stringify({
      client_id,
      redirect_uri,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/auth?${GOOGLE_AUTH_URL_PARAMS}`;
  },
};
exports.GOOGLE_URL = GOOGLE_URL;
const APPLE_URL = {
  AUTH(appleConfig, path) {
    return new apple_auth_1.default(appleConfig, path, 'text');
  },
};
exports.APPLE_URL = APPLE_URL;
const NAVER_URL = {
  USER: 'https://openapi.naver.com/v1/nid/me',
  TOKEN(client_id, client_secret, code) {
    const data = query_string_1.default.stringify({
      grant_type: 'authorization_code',
      client_id,
      client_secret,
      code,
    });
    return `https://nid.naver.com/oauth2.0/token?${data}`;
  },
  AUTH(code, redirect_uri, client_id) {
    return `https://nid.naver.com/oauth2.0/authorize?response_type=code&state=${code}&redirect_url=${redirect_uri}&client_id=${client_id}`;
  },
};
exports.NAVER_URL = NAVER_URL;
