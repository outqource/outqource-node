'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Encrypt = void 0;
const bcrypt_1 = __importDefault(require('bcrypt'));
const crypto_js_1 = __importDefault(require('crypto-js'));
class Encrypt {
  constructor({ aes, saltRound }) {
    this.aesKey = aes;
    this.saltRound = saltRound;
  }
  async hash(value, saltRound) {
    if (!this.saltRound && !saltRound) {
      return null;
    }
    return await bcrypt_1.default.hash(value, this.saltRound || saltRound);
  }
  signAES(value) {
    if (!this.aesKey) {
      return null;
    }
    return crypto_js_1.default.AES.encrypt(value, this.aesKey).toString();
  }
  verifyAES(value) {
    if (!this.aesKey) {
      return null;
    }
    return crypto_js_1.default.AES.decrypt(value, this.aesKey).toString(
      crypto_js_1.default.enc.Utf8,
    );
  }
}
exports.Encrypt = Encrypt;
