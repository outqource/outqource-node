export declare type KakaoUser = {
    id: string;
    nickname: string;
    email: string;
    profileImage?: string;
};
export declare class Kakao {
    static getUser(token: string): Promise<KakaoUser | undefined>;
}
