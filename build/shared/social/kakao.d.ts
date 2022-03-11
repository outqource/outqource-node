import type { Kakao as Types } from "./types";
export declare class Kakao {
    private client_id;
    private client_secret;
    private redirect_url?;
    private api;
    constructor(client_id: string, client_secret: string, redirect_url?: string);
    getToken(code: string, redirectUri?: string): Promise<string | null>;
    getUser(token: string): Promise<Types.User | null>;
    getUserWithToken(code: string, redirect_uri?: string): Promise<Types.TgetUserWithToken>;
}
