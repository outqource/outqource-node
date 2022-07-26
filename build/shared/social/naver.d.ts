import type { Response } from 'express';
import type { Naver as NaverSocial } from './types';
interface INaver {
  clientId: string;
  clientSecret: string | undefined;
  redirectUrl: string | undefined;
}
export declare type NaverUser = NaverSocial.User;
declare class Naver {
  private clientId;
  private clientSecret;
  private redirectUrl;
  constructor(props: INaver);
  getRest(res: Response, code: string, redirectUrl: string | undefined): void;
  static getUser(token: string): Promise<NaverSocial.User | undefined>;
  getToken(code: string): Promise<NaverSocial.Token | undefined>;
  getRestCallback(code: string): Promise<NaverSocial.TgetRestCallback | undefined>;
}
export { Naver };
