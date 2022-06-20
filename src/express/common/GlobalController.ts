import type { Request, Response, NextFunction } from 'express';

export interface IGlobalProps {
  html?: string;
  status?: number;
}

export const globalController = (props?: IGlobalProps) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const html = props?.html || '<h1>outqource-node/express</h1>';
    const status = props?.status || 404;

    res.status(status).contentType('html').send(html);
  };
};
