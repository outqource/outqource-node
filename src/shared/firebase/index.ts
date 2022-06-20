import admin from 'firebase-admin';
import type { Notification } from 'firebase-admin/lib/messaging/messaging-api';

interface SendMessageProps {
  token: string;
  notification: Notification;
}

type SendMessagesProps = Array<SendMessageProps>;

type SendMessageResponse = boolean;

type SendMessagesResponse = {
  success: SendMessageProps[];
  failure: SendMessageProps[];
};

export class FirebaseMessaging {
  private app: admin.app.App;

  constructor(serviceAccount: any) {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendMessage({ token, notification }: SendMessageProps): Promise<SendMessageResponse> {
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

  async sendMessages(messages: SendMessagesProps): Promise<SendMessagesResponse> {
    const result: SendMessagesResponse = { success: [], failure: [] };
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
