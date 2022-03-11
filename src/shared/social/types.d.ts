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
}

export namespace Google {
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
}
