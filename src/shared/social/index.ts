import { Kakao } from './kakao';
import { Google } from './google';
import { Naver } from './naver';
import { Apple } from './apple';

import type { KakaoUser } from './kakao';
import type { GoogleUser } from './google';
import type { NaverUser } from './naver';
import type { AppleUser } from './apple';

class SocialLogin {
  public Kakao = Kakao;
  public Google = Google;
  public Naver = Naver;
}

export { SocialLogin, Kakao, Google, Naver, Apple };
export type { KakaoUser, GoogleUser, NaverUser, AppleUser };
