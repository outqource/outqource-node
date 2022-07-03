/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import queryString from 'query-string';
import type { Response } from 'express';
import type { Kakao as KakaoSocial } from './types';

interface IKakao {
  kakaoRestKey: string | undefined;
  kakaoSecretKey: string | undefined;
  kakaoAdminKey: string | undefined;
  kakaoRedirectUrl: string | undefined;
}

const api = axios.create({
  baseURL: 'https://kauth.kakao.com',
});

export class Kakao {
  private restKey: string | undefined;
  private secretKey: string | undefined;
  private redirectUrl: string | undefined;
  private adminKey: string | undefined;

  constructor(props: IKakao) {
    this.redirectUrl = props.kakaoRedirectUrl;
    this.restKey = props.kakaoRestKey;
    this.secretKey = props.kakaoSecretKey;
    this.adminKey = props.kakaoAdminKey;
  }

  public getRest(res: Response, redirectUrl: string | undefined) {
    if (!this.redirectUrl && !redirectUrl) {
      throw { status: 500, message: 'Kakao Redirect Url is not defined' };
    }

    res.redirect(redirectUrl ?? this.redirectUrl!);
  }

  public async getUser(token: string): Promise<KakaoSocial.TgetUser | undefined> {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    try {
      const response = await api.get('/v2/user/me', {
        headers,
      });

      const { properties, kakao_account: kakaoAccount } = response.data;

      return {
        kakaoAccount,
        properties,
      };
    } catch (error) {
      return undefined;
    }
  }

  public async getToken(code: string, redirectUri?: string): Promise<string | undefined> {
    const data = queryString.stringify({
      grant_type: 'authorization_code',
      client_id: this.restKey,
      client_secret: this.secretKey,
      redirectUri: redirectUri || this.redirectUrl,
      code,
    });

    try {
      const response = await api.post('/oauth/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const token = response.data?.access_token;
      return token;
    } catch (error) {
      return undefined;
    }
  }

  public async getRestCallback(code: string): Promise<KakaoSocial.TgetRestCallback | undefined> {
    try {
      const token = await this.getToken(code);
      if (!token) {
        throw { status: 400, message: '카카오 토큰 발급 오류!' };
      }

      const user = await this.getUser(token);
      if (!user) {
        throw { status: 500, message: '카카오 유저정보 발급 오류!' };
      }

      return { token, user };
    } catch (error) {
      return undefined;
    }
  }

  public async logout(id: string, adminKey?: string): Promise<boolean> {
    try {
      if (!adminKey && !this.adminKey) {
        throw { status: 500, message: '카카오 어드민키가 없습니다.' };
      }

      const headers = {
        Authorization: `KakaoAK ${adminKey ?? this.adminKey}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      };

      const data = queryString.stringify({
        target_id_type: 'user_id',
        target_id: id,
      });

      await api.post('/v1/user/logout', data, { headers });

      return true;
    } catch (err: any) {
      return false;
    }
  }
}
