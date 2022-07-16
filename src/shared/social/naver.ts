/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import type { Response } from 'express';
import { NAVER_URL } from './constant';
import type { Naver as NaverSocial } from './types';

interface INaver {
  clientId: string;
  clientSecret: string | undefined;
  redirectUrl: string | undefined;
}

export type NaverUser = NaverSocial.User;

class Naver {
  private clientId: string;
  private clientSecret: string | undefined;
  private redirectUrl: string | undefined;

  constructor(props: INaver) {
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.redirectUrl = props.redirectUrl;
  }

  public getRest(res: Response, code: string, redirectUrl: string | undefined) {
    if (!this.redirectUrl && !redirectUrl) throw { status: 500, message: 'Naver Redirect Url is not defined' };

    res.redirect(NAVER_URL.AUTH(code, redirectUrl ?? this.redirectUrl!, this.clientId));
  }

  static async getUser(token: string): Promise<NaverSocial.User | undefined> {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios.get(NAVER_URL.USER, { headers });
      const { response: naverResponse } = response.data;

      const { id, email, gender, age, mobile: phoneNumber } = naverResponse;

      return {
        id,
        email,
        gender,
        age,
        phoneNumber,
      };
    } catch (err) {
      return undefined;
    }
  }

  public async getToken(code: string): Promise<NaverSocial.Token | undefined> {
    try {
      if (!this.clientSecret) throw { status: 500, message: 'Naver Client Secret is not defined' };

      const response = await axios.get(NAVER_URL.TOKEN(code, this.clientId, this.clientSecret));
      const { access_token: token, token_type: tokenType } = response.data;

      return { token, tokenType };
    } catch (err) {
      return undefined;
    }
  }

  public async getRestCallback(code: string): Promise<NaverSocial.TgetRestCallback | undefined> {
    try {
      const tokenInfo = await this.getToken(code);

      if (!tokenInfo) {
        throw { status: 400, message: '네이버 토큰 발급 오류!' };
      }

      const user = await Naver.getUser(tokenInfo.token);
      if (!user) {
        throw { status: 500, message: '네이버 유저정보 발급 오류!' };
      }

      return { ...tokenInfo, user };
    } catch (error) {
      return undefined;
    }
  }
}

export { Naver };
