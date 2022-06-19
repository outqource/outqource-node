'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken = getUser => {
  return async (req, res, next) => {
    try {
      req.user = undefined;
      const headers = req.headers;
      const authorization =
        headers['authorization'] || headers['Authorization'];
      if (
        (authorization === null || authorization === void 0
          ? void 0
          : authorization.includes('Bearer')) ||
        (authorization === null || authorization === void 0
          ? void 0
          : authorization.includes('bearer'))
      ) {
        if (typeof authorization === 'string') {
          const bearers = authorization.split(' ');
          if (bearers.length === 2 && typeof bearers[1] === 'string') {
            const accessToken = bearers[1];
            let user = undefined;
            if (getUser) {
              user = await getUser(accessToken);
            }
            if (user) {
              req.user = user;
            } else {
              req.user = undefined;
            }
            next();
          } else {
            next({ status: 400, message: 'Authorization Fail' });
          }
        } else {
          next({ status: 400, message: 'Authorization Fail' });
        }
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};
exports.default = jsonwebtoken;
