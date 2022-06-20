interface SendMessageProps {
  phoneNumber: string;
  message: string;
}
declare type SendMessagesProps = Array<SendMessageProps>;
declare type SendMessageResponse = boolean;
declare type SendMessagesResponse = {
  success: SendMessageProps[];
  failure: SendMessageProps[];
};
export declare class Aligo {
  private userId;
  private key;
  private sender;
  constructor(userId: string, key: string, sender: string);
  sendMessage({ phoneNumber, message }: SendMessageProps): Promise<SendMessageResponse>;
  sendMessages(props: SendMessagesProps): Promise<SendMessagesResponse>;
}
export {};
