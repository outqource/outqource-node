import { Kakao, KakaoUser } from './kakao';
import { Google, GoogleUser } from './google';

class SocialLogin {
  public Kakao = Kakao;
  public Google = Google;
}

export { SocialLogin, Kakao, Google };
export type { KakaoUser, GoogleUser };
