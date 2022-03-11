/// <reference types="node" />
import type { SignOptions, VerifyOptions } from "jsonwebtoken";
declare type JwtPayload = string | Buffer | object;
export declare class Jsonwebtoken {
    private jwtKey;
    private signOptions?;
    private verifyOptions?;
    constructor(jwtKey: string, props?: {
        signOptions?: SignOptions;
        verifyOptions?: VerifyOptions;
    });
    signJwt(value: JwtPayload, options?: SignOptions): unknown;
    verifyJwt<T = any>(token: string, options?: VerifyOptions): T | any;
}
export {};
