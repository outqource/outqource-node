const KAKAO_URL = {
  TOKEN: 'https://kauth.kakao.com/oauth/token',
  USER: 'https://kapi.kakao.com/v2/user/me',
  LOGOUT: 'https://kapi.kakao.com/v1/user/logout',
  AUTH(restKey: string, redirectUrl: string) {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${restKey}&redirect_uri=${redirectUrl}&response_type=code`;
  },
};
const GOOGLE_URL = {
  TOKEN: 'https://oauth2.googleapis.com/token',
  USER: 'https://www.googleapis.com/oauth2/v2/userinfo',
};

export { KAKAO_URL, GOOGLE_URL };
