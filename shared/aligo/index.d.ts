import type { Aligo as Types } from "./types";
declare class Aligo {
    private userId;
    private key;
    private sender;
    constructor(userId: string, key: string, sender: string);
    sendMessage({ phoneNumber, message, }: Types.sendMessage): Promise<boolean>;
    sendMessages(props: Types.sendMessages): Promise<Types.TsendMessages>;
}
export { Aligo };
