import AppleAuth from 'apple-auth';
import type { Response } from 'express';
import type { AppleAuthConfig } from 'apple-auth';

interface IApple {
  appleConfig: AppleAuthConfig;
  path: string;
}

class Apple {
  private appleAuth: AppleAuth;

  constructor(props: IApple) {
    this.appleAuth = new AppleAuth(props.appleConfig, props.path, 'text');
  }

  public getRest(res: Response) {
    res.redirect(this.appleAuth.loginURL());
  }
}
