import type { Request, Response, NextFunction } from "express";
declare const test: (condition: boolean) => (req: Request, res: Response, next: NextFunction) => void;
export default test;
