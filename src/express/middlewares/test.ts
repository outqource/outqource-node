import type { Request, Response, NextFunction } from "express";

const test = (condition: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (condition) {
      next();
    } else {
      next({ status: 400, message: "개발 서버에서만 작동하는 API 입니다" });
    }
  };
};

export default test;
