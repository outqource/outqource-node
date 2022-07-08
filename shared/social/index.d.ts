import { Kakao } from './kakao';
import { Google } from './google';
import { Naver } from './naver';
import { Apple } from './apple';
import type { KakaoUser } from './kakao';
import type { GoogleUser } from './google';
import type { NaverUser } from './naver';
import type { AppleUser } from './apple';
declare class SocialLogin {
  Kakao: typeof Kakao;
  Google: typeof Google;
  Naver: typeof Naver;
}
export { SocialLogin, Kakao, Google, Naver, Apple };
export type { KakaoUser, GoogleUser, NaverUser, AppleUser };
