'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Aligo = void 0;
const axios_1 = __importDefault(require('axios'));
class Aligo {
  constructor(userId, key, sender) {
    this.userId = userId;
    this.key = key;
    this.sender = sender;
  }
  async sendMessage({ phoneNumber, message }) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const params = new URLSearchParams();
    params.append('user_id', this.userId);
    params.append('key', this.key);
    params.append('sender', this.sender);
    params.append('receiver', phoneNumber);
    params.append('msg', message);
    params.append('msg_type', 'SMS');
    try {
      await axios_1.default.post('https://apis.aligo.in/send/', params, { headers });
      return true;
    } catch (error) {
      return false;
    }
  }
  async sendMessages(props) {
    const result = { success: [], failure: [] };
    for (const prop of props) {
      const response = await this.sendMessage(prop);
      if (response) {
        result.success.push(prop);
      } else {
        result.failure.push(prop);
      }
    }
    return result;
  }
}
exports.Aligo = Aligo;
