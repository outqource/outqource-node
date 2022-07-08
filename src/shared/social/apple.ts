import AppleAuth from 'apple-auth';
import jwt from 'jsonwebtoken';

import type { Response } from 'express';
import type { AppleAuthConfig } from 'apple-auth';
import type { Apple as AppleTypes } from './types';

interface IApple {
  appleConfig: AppleAuthConfig;
  path: string;
}

export type AppleUser = AppleTypes.User;

class Apple {
  private appleAuth: AppleAuth;

  constructor(props: IApple) {
    this.appleAuth = new AppleAuth(props.appleConfig, props.path, 'text');
  }

  public getRest(res: Response) {
    res.redirect(this.appleAuth.loginURL());
  }

  static async getUser(id_token: string): Promise<AppleTypes.User | undefined> {
    try {
      const idToken = jwt.decode(id_token) as {
        sub: string;
        email?: string;
      };

      if (!idToken?.sub) return undefined;

      return {
        id: idToken.sub as string,
        email: idToken.email,
      };
    } catch (error) {
      return undefined;
    }
  }

  public async getRestCallback(code: string): Promise<AppleTypes.User | undefined> {
    try {
      const user = await Apple.getUser(code);

      if (!user) throw { status: 500, message: '애플 유저 정보 발급 오류!' };

      return user;
    } catch (err) {
      return undefined;
    }
  }
}

export { Apple };
