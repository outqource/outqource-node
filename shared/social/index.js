'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Apple = exports.Naver = exports.Google = exports.Kakao = exports.SocialLogin = void 0;
const kakao_1 = require('./kakao');
Object.defineProperty(exports, 'Kakao', {
  enumerable: true,
  get: function () {
    return kakao_1.Kakao;
  },
});
const google_1 = require('./google');
Object.defineProperty(exports, 'Google', {
  enumerable: true,
  get: function () {
    return google_1.Google;
  },
});
const naver_1 = require('./naver');
Object.defineProperty(exports, 'Naver', {
  enumerable: true,
  get: function () {
    return naver_1.Naver;
  },
});
const apple_1 = require('./apple');
Object.defineProperty(exports, 'Apple', {
  enumerable: true,
  get: function () {
    return apple_1.Apple;
  },
});
class SocialLogin {
  constructor() {
    this.Kakao = kakao_1.Kakao;
    this.Google = google_1.Google;
    this.Naver = naver_1.Naver;
  }
}
exports.SocialLogin = SocialLogin;
