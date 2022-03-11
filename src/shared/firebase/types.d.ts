/* eslint-disable @typescript-eslint/no-namespace */
import type { Notification, TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';

export namespace FirebaseMessaging {
  export interface sendMessage {
    token: string;
    notification: Notification;
  }

  export type TsendMessage = boolean;

  export type sendMessages = Array<sendMessage>;

  export type TsendMessages = {
    success: sendMessage[];
    failure: sendMessage[];
  };
}
