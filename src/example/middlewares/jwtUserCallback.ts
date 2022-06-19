import { Jsonwebtoken } from '../../shared';

const JWT_KEY = 'outqource-node-JWT_KEY';

const jwt = new Jsonwebtoken(JWT_KEY);

export type JWTPayload = { id: string; key: string };

const jwtUserCallback = async (accessToken: string) => {
  const userPayload: JWTPayload = jwt.verifyJwt<JWTPayload>(accessToken);

  return {
    id: 'test',
    key: 'test',
  };
};

export default jwtUserCallback;
