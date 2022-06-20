'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.FirebaseMessaging = void 0;
const firebase_admin_1 = __importDefault(require('firebase-admin'));
class FirebaseMessaging {
  constructor(serviceAccount) {
    this.app = firebase_admin_1.default.initializeApp({
      credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
  }
  async sendMessage({ token, notification }) {
    try {
      await this.app.messaging().send({
        token,
        notification,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  async sendMessages(messages) {
    const result = { success: [], failure: [] };
    for await (const message of messages) {
      const messageResult = await this.sendMessage({
        token: message.token,
        notification: message.notification,
      });
      if (messageResult) {
        result.success.push(message);
      } else {
        result.failure.push(message);
      }
    }
    return result;
  }
}
exports.FirebaseMessaging = FirebaseMessaging;
