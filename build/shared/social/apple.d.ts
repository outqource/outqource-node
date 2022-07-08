import type { Response } from 'express';
import type { AppleAuthConfig } from 'apple-auth';
import type { Apple as AppleTypes } from './types';
interface IApple {
  appleConfig: AppleAuthConfig;
  path: string;
}
export declare type AppleUser = AppleTypes.User;
declare class Apple {
  private appleAuth;
  constructor(props: IApple);
  getRest(res: Response): void;
  static getUser(id_token: string): Promise<AppleTypes.User | undefined>;
  getRestCallback(code: string): Promise<AppleTypes.User | undefined>;
}
export { Apple };
