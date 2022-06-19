import jwt from 'jsonwebtoken';
import type { SignOptions, VerifyOptions } from 'jsonwebtoken';

type JwtPayload = string | Buffer | object;

export class Jsonwebtoken {
  private jwtKey: string;
  private signOptions?: SignOptions;
  private verifyOptions?: VerifyOptions;

  constructor(
    jwtKey: string,
    props?: { signOptions?: SignOptions; verifyOptions?: VerifyOptions },
  ) {
    this.jwtKey = jwtKey;
    this.signOptions = props?.signOptions;
    this.verifyOptions = props?.verifyOptions;
  }

  signJwt<T = any>(value: JwtPayload, options?: SignOptions): T | any {
    try {
      if (
        typeof value !== 'string' &&
        typeof value !== 'object' &&
        !Buffer.isBuffer(value)
      ) {
        throw { status: 400, message: 'BadRequest Payload' };
      }

      return jwt.sign(
        value as JwtPayload,
        this.jwtKey,
        options || this.signOptions,
      );
    } catch (error) {
      return error;
    }
  }

  verifyJwt<T = any>(token: string, options?: VerifyOptions): T | any {
    try {
      return jwt.verify(token, this.jwtKey, options || this.verifyOptions) as T;
    } catch (error) {
      return error;
    }
  }
}
