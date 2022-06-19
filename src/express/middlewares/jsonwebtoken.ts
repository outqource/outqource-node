/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const jsonwebtoken = (getUser?: (accessToken: string) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user = undefined;

      const headers = req.headers;
      const authorization =
        headers['authorization'] || headers['Authorization'];
      if (
        authorization?.includes('Bearer') ||
        authorization?.includes('bearer')
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

export default jsonwebtoken;
