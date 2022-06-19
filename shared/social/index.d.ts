import { Kakao, KakaoUser } from './kakao';
import { Google, GoogleUser } from './google';
declare class SocialLogin {
  Kakao: typeof Kakao;
  Google: typeof Google;
}
export { SocialLogin, Kakao, Google };
export type { KakaoUser, GoogleUser };
