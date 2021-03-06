export namespace Kakao {
  export type User = {
    id: string;
    email?: string;
    nickname?: string;
    profileImage?: string;
  };
  export type TgetUserWithToken = {
    status: number;
    message: string;
    data?: { token: string; user: User };
  };
  type profile = {
    nickname?: string;
    thumbnail_image_url?: string;
    profile_image_url?: string;
    is_default_image?: boolean;
  };
  type account = {
    profile?: Profile;
    name?: string;
    email?: string;
    birthyear?: string;
    birthday?: string;
    gender?: 'female' | 'male';
    phone_number?: string;
    [key: string]: any;
  };
  export type TgetUser = {
    id: string;
    properties: Pick<profile, 'nickname'> & {
      profile_image: string;
      thumbnail_image: string;
    };
    kakaoAccount: account;
  };

  export type TgetRestCallback = {
    token: string;
    user: TgetUser;
  };
}

export namespace Google {
  export type User = {
    id: string;
    email?: string;
    nickname?: string;
    profileImage?: string;
  };

  export type TgetRestCallback = {
    token: string;
    user: User;
  };
}

export namespace Naver {
  export type User = {
    id: string;
    email?: string;
    gender?: string;
    age?: string;
    phoneNumber?: string;
  };

  export type Token = {
    token: string;
    tokenType: string;
  };

  export type TgetRestCallback = Token & {
    user: User;
  };
}

export namespace Apple {
  export type User = {
    id: string;
    email?: string;
  };
}
