import bcrypt from 'bcrypt';
import Crypto from 'crypto-js';
import type { Encrypt as Types } from './types';

export class Encrypt {
  private aesKey?: string;
  private saltRound?: number;

  constructor({ aes, saltRound }: Types.constructor) {
    this.aesKey = aes;
    this.saltRound = saltRound;
  }

  async hash(value: string, saltRound?: number): Promise<string | null> {
    if (!this.saltRound && !saltRound) {
      return null;
    }

    return await bcrypt.hash(value, (this.saltRound || saltRound) as number);
  }

  signAES(value: string): string | null {
    if (!this.aesKey) {
      return null;
    }
    return Crypto.AES.encrypt(value, this.aesKey).toString();
  }

  verifyAES(value: string): string | null {
    if (!this.aesKey) {
      return null;
    }
    return Crypto.AES.decrypt(value, this.aesKey).toString(Crypto.enc.Utf8);
  }
}
