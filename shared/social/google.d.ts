import type { Response } from 'express';
import type { Google as GoogleSocial } from './types';
interface IGoogle {
  clientId: string;
  clientSecret: string | undefined;
  redirectUri: string | undefined;
}
export declare type GoogleUser = GoogleSocial.User;
export declare class Google {
  private clientId;
  private clientSecret;
  private redirectUri;
  constructor(props: IGoogle);
  getRest(res: Response, redirectUrl: string | undefined): void;
  getToken(code: string): Promise<string | undefined>;
  static getAppUser(token: string): Promise<GoogleSocial.User | undefined>;
  static getWebUser(token: string): Promise<
    | {
        id: any;
        email: any;
        nickname: any;
        profileImage: any;
      }
    | undefined
  >;
  getRestCallback(code: string): Promise<GoogleSocial.TgetRestCallback | undefined>;
}
export {};
