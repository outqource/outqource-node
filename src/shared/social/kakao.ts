import axios, { AxiosInstance } from "axios";
import queryString from "query-string";
import constant from "./constant";
import type { Kakao as Types } from "./types";

const { KAKAO } = constant;

export class Kakao {
  private client_id: string;
  private client_secret: string;
  private redirect_url?: string;
  private api: AxiosInstance;

  constructor(client_id: string, client_secret: string, redirect_url?: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.redirect_url = redirect_url;
    this.api = axios.create({
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  }

  async getToken(code: string, redirectUri?: string): Promise<string | null> {
    const data = queryString.stringify({
      grant_type: "authorization_code",
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirectUri: redirectUri || this.redirect_url,
      code,
    });

    try {
      const response = await this.api.post(KAKAO.TOKEN_URL, data);
      const token = response.data?.access_token;
      return token;
    } catch (error) {
      return null;
    }
  }

  async getUser(token: string): Promise<Types.User | null> {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    };

    try {
      const response = await this.api.get(KAKAO.USER_URL, { headers });

      const { id, properties, kakao_account: kakaoAccount } = response.data;
      const { nickname, profile_image: profileImage } = properties;
      const { email } = kakaoAccount;

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

  async getUserWithToken(
    code: string,
    redirect_uri?: string
  ): Promise<Types.TgetUserWithToken> {
    const token = await this.getToken(code, redirect_uri);
    if (!token) {
      return {
        status: 400,
        message: "카카오 토큰 발급 오류!",
      };
    }

    const user = await this.getUser(token);
    if (!user) {
      return {
        status: 500,
        message: "카카오 유저정보 발급 오류!",
      };
    }

    return {
      status: 200,
      message: "성공",
      data: { token, user },
    };
  }
}
