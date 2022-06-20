'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const shared_1 = require('../../shared');
const JWT_KEY = 'outqource-node-JWT_KEY';
const jwt = new shared_1.Jsonwebtoken(JWT_KEY);
const jwtUserCallback = async accessToken => {
  const userPayload = jwt.verifyJwt(accessToken);
  return {
    id: 'test',
    key: 'test',
  };
};
exports.default = jwtUserCallback;
