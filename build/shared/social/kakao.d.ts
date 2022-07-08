import type { Response } from 'express';
import type { Kakao as KakaoSocial } from './types';
interface IKakao {
  kakaoRestKey: string;
  kakaoSecretKey: string | undefined;
  kakaoAdminKey: string | undefined;
  kakaoRedirectUrl: string | undefined;
}
export declare type KakaoUser = KakaoSocial.User;
export declare class Kakao {
  private restKey;
  private secretKey;
  private redirectUrl;
  private adminKey;
  constructor(props: IKakao);
  getRest(res: Response, redirectUrl: string | undefined): void;
  static getUser(token: string): Promise<KakaoSocial.TgetUser | undefined>;
  getToken(code: string, redirectUri?: string): Promise<string | undefined>;
  getRestCallback(code: string): Promise<KakaoSocial.TgetRestCallback | undefined>;
  logout(id: string, adminKey?: string): Promise<boolean>;
}
export {};
