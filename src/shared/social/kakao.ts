import axios from "axios";

export type KakaoUser = {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
};

export class Kakao {
  static async getUser(token: string): Promise<KakaoUser | undefined> {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    try {
      const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers,
      });

      const { id, properties, kakao_account: kakaoAccount } = response.data;
      const { nickname, profile_image: profileImage } = properties;
      const { email } = kakaoAccount;

      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error) {
      return undefined;
    }
  }
}
