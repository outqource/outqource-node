import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      take?: number;
      skip?: number;
    }
  }
}

const pagination = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const page = (req.query?.page || "1") as string;
    const limit = (req.query?.limit || "20") as string;

    const take = Number(limit) || 20;
    const skip = (Number(page) - 1) * take;

    req.take = take;
    req.skip = skip;

    next();
  };
};

export default pagination;
