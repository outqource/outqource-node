import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare const jsonwebtoken: (getUser?: ((accessToken: string) => Promise<any>) | undefined) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default jsonwebtoken;
