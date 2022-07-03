import { Kakao } from './kakao';
import { Google } from './google';
import { Naver } from './naver';

import type { KakaoUser } from './kakao';
import type { GoogleUser } from './google';
import type { NaverUser } from './naver';

class SocialLogin {
  public Kakao = Kakao;
  public Google = Google;
  public Naver = Naver;
}

export { SocialLogin, Kakao, Google, Naver };
export type { KakaoUser, GoogleUser, NaverUser };
