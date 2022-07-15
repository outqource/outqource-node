/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';

import type { Response } from 'express';
import type { Google as GoogleSocial } from './types';

import { GOOGLE_URL } from './constant';

interface IGoogle {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
}

export type GoogleUser = GoogleSocial.User;
export class Google {
  private clientId: string;
  private clientSecret: string | undefined;
  private redirectUri: string | undefined;

  constructor(props: IGoogle) {
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.redirectUri = props.redirectUri;
  }

  public getRest(res: Response, redirectUrl: string | undefined) {
    if (!this.redirectUri && !redirectUrl) {
      throw { status: 500, message: 'Google Redirect Url is not defined' };
    }

    res.redirect(GOOGLE_URL.AUTH(this.clientId, redirectUrl ?? this.redirectUri!));
  }

  public async getToken(code: string): Promise<string | undefined> {
    if (this.clientSecret || this.redirectUri)
      throw { status: 500, message: 'Google Client Secret or Redirect Url is not defined' };

    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      code,
    };

    try {
      const response = await axios.post(GOOGLE_URL.TOKEN, data);

      return response.data?.access_token;
    } catch (error) {
      return undefined;
    }
  }

  static async getAppUser(token: string): Promise<GoogleSocial.User | undefined> {
    try {
      const response = await axios.get(GOOGLE_URL.USER_APP(token));
      const { id, email, name: nickname, picture: profileImage } = response.data;

      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error: any) {
      const { response } = error;
      if (response.data.error === 'invalid_token') throw { status: 403, message: 'GOOGLE_TOKEN_EXPIRED' };
      return undefined;
    }
  }

  static async getWebUser(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(GOOGLE_URL.USER_WEB, { headers });
      const { id, email, name: nickname, picture: profileImage } = response.data;

      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error: any) {
      const { response } = error;
      if (response.data.error === 'invalid_token') throw { status: 403, message: 'GOOGLE_TOKEN_EXPIRED' };
      return undefined;
    }
  }
  public async getRestCallback(code: string): Promise<GoogleSocial.TgetRestCallback | undefined> {
    try {
      const user = await Google.getWebUser(code);
      if (!user) {
        throw { status: 500, message: '구글 유저정보 발급 오류!' };
      }

      return { token: code, user };
    } catch (error: any) {
      return undefined;
    }
  }
}
