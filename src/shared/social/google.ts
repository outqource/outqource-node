import axios from "axios";
import queryString from "query-string";

import constant from "./constant";
import type { Google as Types } from "./types";

const { GOOGLE } = constant;

export class Google {
  private client_id: string;
  private client_secret: string;
  private redirect_url: string;

  constructor(client_id: string, client_secret: string, redirect_url: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_url = redirect_url;
  }

  async getToken(code: string): Promise<string | null> {
    const data = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_url,
      grant_type: "authorization_code",
      code,
    };

    try {
      const response = await axios.post(GOOGLE.TOKEN_URL, data);
      const { access_token } = response.data;
      return access_token as string;
    } catch (error) {
      return null;
    }
  }

  async getUser(token: string): Promise<Types.User | null> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(GOOGLE.USER_URL, {
        headers,
      });

      const {
        id,
        email,
        name: nickname,
        picture: profileImage,
      } = response.data;

      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error) {
      return null;
    }
  }

  async getUserWithToken(code: string): Promise<Types.TgetUserWithToken> {
    const token = await this.getToken(code);
    if (!token) {
      return {
        status: 500,
        message: "구글 토큰 발급 오류!",
      };
    }

    const user = await this.getUser(token);
    if (!user) {
      return {
        status: 500,
        message: "구글 사용자 가져오기 오류!",
      };
    }

    return {
      status: 200,
      message: "성공",
      data: { token, user },
    };
  }
}
