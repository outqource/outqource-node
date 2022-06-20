import type { Notification } from 'firebase-admin/lib/messaging/messaging-api';
interface SendMessageProps {
  token: string;
  notification: Notification;
}
declare type SendMessagesProps = Array<SendMessageProps>;
declare type SendMessageResponse = boolean;
declare type SendMessagesResponse = {
  success: SendMessageProps[];
  failure: SendMessageProps[];
};
export declare class FirebaseMessaging {
  private app;
  constructor(serviceAccount: any);
  sendMessage({ token, notification }: SendMessageProps): Promise<SendMessageResponse>;
  sendMessages(messages: SendMessagesProps): Promise<SendMessagesResponse>;
}
export {};
