import admin from 'firebase-admin';
import type { Notification } from 'firebase-admin/lib/messaging/messaging-api';

import type { FirebaseMessaging as Types } from './types';

class FirebaseMessaging {
  private app: admin.app.App;

  constructor(serviceAccount: any) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendMessage({ token, notification }: Types.sendMessage): Promise<Types.TsendMessage> {
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

  async sendMessages(messages: Types.sendMessages): Promise<Types.TsendMessages> {
    const result: Types.TsendMessages = { success: [], failure: [] };
    for await (const message of messages) {
      const messageResult = await this.sendMessage({
        token: message.token,
        notification: message.notification as Notification,
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

export { FirebaseMessaging };
