'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const getOpenAPIPathSecurity = api => {
  const security = [];
  if (api.auth) {
    if (api.auth === 'jwt') security.push({ bearerAuth: [] });
  }
  return security;
};
exports.default = getOpenAPIPathSecurity;
