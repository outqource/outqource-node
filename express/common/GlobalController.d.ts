import type { Request, Response, NextFunction } from 'express';
export interface IGlobalProps {
  html?: string;
  status?: number;
}
export declare const globalController: (
  props?: IGlobalProps | undefined,
) => (req: Request, res: Response, next: NextFunction) => void;
