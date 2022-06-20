export declare type JWTPayload = {
  id: string;
  key: string;
};
declare const jwtUserCallback: (accessToken: string) => Promise<{
  id: string;
  key: string;
}>;
export default jwtUserCallback;
