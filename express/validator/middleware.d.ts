import { Request, Response, NextFunction } from "express";
import { JSONSchemaType, ValidateFunction } from "ajv";
export declare type CreateAJVMiddlewareProps<P, Q, B> = {
    params?: JSONSchemaType<P>;
    query?: JSONSchemaType<Q>;
    body?: JSONSchemaType<B>;
};
export declare type AjvValidators<P, Q, B> = {
    params?: ValidateFunction<P>;
    query?: ValidateFunction<Q>;
    body?: ValidateFunction<B>;
};
declare const createAjvMiddleware: <P, Q, B>(props?: CreateAJVMiddlewareProps<P, Q, B> | undefined) => (req: Request, res: Response, next: NextFunction) => void;
export default createAjvMiddleware;
