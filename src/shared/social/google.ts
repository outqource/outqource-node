import axios from 'axios';

export type GoogleUser = {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
};

export class Google {
  static async getUser(token: string): Promise<GoogleUser | undefined> {
    try {
      const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
      const { id, email, name: nickname, picture: profileImage } = response.data;
      return {
        id,
        email,
        nickname,
        profileImage,
      };
    } catch (error: any) {
      const { response } = error;
      if (response.data.error === 'invalid_token') throw { status: 403, message: 'GOOGLE_TOKEN_EXPIRED' };
      return undefined;
    }
  }
}
