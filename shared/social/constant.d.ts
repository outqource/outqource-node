import AppleAuth from 'apple-auth';
import type { AppleAuthConfig } from 'apple-auth';
declare const KAKAO_URL: {
  TOKEN: string;
  USER: string;
  LOGOUT: string;
  AUTH(restKey: string, redirectUrl: string): string;
};
declare const GOOGLE_URL: {
  TOKEN: string;
  USER_WEB: string;
  USER_APP(id_token: string): string;
  AUTH(client_id: string, redirect_uri: string): string;
};
declare const APPLE_URL: {
  AUTH(appleConfig: AppleAuthConfig, path: string): AppleAuth;
};
declare const NAVER_URL: {
  USER: string;
  TOKEN(client_id: string, client_secret: string, code: string): string;
  AUTH(code: string | number, redirect_uri: string, client_id: string): string;
};
export { KAKAO_URL, GOOGLE_URL, APPLE_URL, NAVER_URL };
