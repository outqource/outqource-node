import axios from "axios";
import type { Aligo as Types } from "./types";

class Aligo {
  private userId: string;
  private key: string;
  private sender: string;

  constructor(userId: string, key: string, sender: string) {
    this.userId = userId;
    this.key = key;
    this.sender = sender;
  }

  async sendMessage({
    phoneNumber,
    message,
  }: Types.sendMessage): Promise<boolean> {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const params = new URLSearchParams();
    params.append("user_id", this.userId);
    params.append("key", this.key);
    params.append("sender", this.sender);
    params.append("receiver", phoneNumber);
    params.append("msg", message);
    params.append("msg_type", "SMS");

    try {
      await axios.post("https://apis.aligo.in/send/", params, { headers });
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendMessages(props: Types.sendMessages): Promise<Types.TsendMessages> {
    const result: Types.TsendMessages = { success: [], failure: [] };
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

export { Aligo };
