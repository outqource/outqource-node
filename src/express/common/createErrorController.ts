import type { NextFunction, Request, Response } from "express";

type Error = {
  status?: number;
  message?: string;
};

export interface IErrorProps {
  header?: string;
  isConsole?: boolean;
}

export const createErrorController = (props?: IErrorProps) => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    let header = props?.header;
    const isConsole = props?.isConsole;

    const error = {
      status: err.status || 500,
      message: err.message || "Server Internal Error",
      ...err,
    };

    if (!header) {
      header = `Error! Occurred`;
    }
    if (typeof isConsole === "undefined" || isConsole) {
      console.warn(header, err);
    }

    res.status(error.status).json(error);
  };
};
