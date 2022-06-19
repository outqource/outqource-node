import type { Request, Response, NextFunction } from 'express';
declare global {
  namespace Express {
    interface Request {
      take?: number;
      skip?: number;
    }
  }
}
declare const pagination: () => (req: Request, res: Response, next: NextFunction) => void;
export default pagination;
