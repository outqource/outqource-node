import type { NextFunction, Request, Response } from 'express';
declare type Error = {
  status?: number;
  message?: string;
};
export interface IErrorProps {
  header?: string;
  isConsole?: boolean;
}
export declare const errorController: (
  props?: IErrorProps | undefined,
) => (err: Error, req: Request, res: Response, next: NextFunction) => void;
export {};
