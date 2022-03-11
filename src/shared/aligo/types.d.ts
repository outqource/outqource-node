export namespace Aligo {
  export interface sendMessage {
    phoneNumber: string;
    message: string;
  }

  export type TsendMessage = boolean;

  export type sendMessages = Array<sendMessage>;

  export type TsendMessages = {
    success: sendMessage[];
    failure: sendMessage[];
  };
}
