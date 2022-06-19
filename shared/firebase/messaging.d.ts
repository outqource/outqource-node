import type { FirebaseMessaging as Types } from './types';
declare class FirebaseMessaging {
  private app;
  constructor(serviceAccount: any);
  sendMessage({
    token,
    notification,
  }: Types.sendMessage): Promise<Types.TsendMessage>;
  sendMessages(messages: Types.sendMessages): Promise<Types.TsendMessages>;
}
export { FirebaseMessaging };
