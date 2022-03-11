export namespace Encrypt {
  export interface constructor {
    aes?: string;
    saltRound?: number;
  }

  export interface hash {
    value: string;
    saltRound?;
  }
}
