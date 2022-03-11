import type { Encrypt as Types } from "./types";
export declare class Encrypt {
    private aesKey?;
    private saltRound?;
    constructor({ aes, saltRound }: Types.constructor);
    hash(value: string, saltRound?: number): Promise<string | null>;
    signAES(value: string): string | null;
    verifyAES(value: string): string | null;
}
