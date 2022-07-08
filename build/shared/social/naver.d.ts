import type { Response } from 'express';
import type { Naver as NaverSocial } from './types';
interface INaver {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
}
export declare type NaverUser = NaverSocial.User;
declare class Naver {
  private clientId;
  private clientSecret;
  private redirectUri;
  constructor(props: INaver);
  getRest(res: Response, redirectUri: string | undefined, code: string): void;
  static getUser(token: string): Promise<NaverSocial.User | undefined>;
  getToken(code: string): Promise<NaverSocial.Token | undefined>;
  getRestCallback(code: string): Promise<NaverSocial.TgetRestCallabck | undefined>;
}
export { Naver };
