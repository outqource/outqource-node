export declare type GoogleUser = {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
};
export declare class Google {
  static getUser(token: string): Promise<GoogleUser | undefined>;
}
