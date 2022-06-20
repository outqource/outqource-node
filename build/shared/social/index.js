'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Google = exports.Kakao = exports.SocialLogin = void 0;
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
class SocialLogin {
  constructor() {
    this.Kakao = kakao_1.Kakao;
    this.Google = google_1.Google;
  }
}
exports.SocialLogin = SocialLogin;
