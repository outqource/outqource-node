import type { Google as Types } from "./types";
export declare class Google {
    private client_id;
    private client_secret;
    private redirect_url;
    constructor(client_id: string, client_secret: string, redirect_url: string);
    getToken(code: string): Promise<string | null>;
    getUser(token: string): Promise<Types.User | null>;
    getUserWithToken(code: string): Promise<Types.TgetUserWithToken>;
}
