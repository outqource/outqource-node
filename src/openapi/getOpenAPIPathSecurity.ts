import { ControllerAPI } from './types';

const getOpenAPIPathSecurity = (api: ControllerAPI) => {
  const security = [];
  if (api.auth) {
    if (api.auth === 'jwt') security.push({ bearerAuth: [] });
  }

  return security;
};

export default getOpenAPIPathSecurity;
