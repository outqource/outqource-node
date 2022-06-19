import { Request, Response, NextFunction } from "express";
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";

export type CreateAJVMiddlewareProps<P = any, Q = any, B = any> = {
  params?: JSONSchemaType<P>;
  query?: JSONSchemaType<Q>;
  body?: JSONSchemaType<B>;
};

export type AjvValidators<P = any, Q = any, B = any> = {
  params?: ValidateFunction<P>;
  query?: ValidateFunction<Q>;
  body?: ValidateFunction<B>;
};

const createAjvMiddleware = <P = any, Q = any, B = any>(
  props?: CreateAJVMiddlewareProps<P, Q, B>
) => {
  let ajv: Ajv | undefined = undefined;

  if (!props) props = {};

  const validators: AjvValidators<P, Q, B> = {};

  if (props.params) {
    ajv = new Ajv({ coerceTypes: true });
    validators.params = ajv.compile<P>(props.params);
  }

  if (props.query) {
    ajv = new Ajv();
    validators.query = ajv.compile<Q>(props.query);
  }

  if (props.body) {
    ajv = new Ajv();
    validators.body = ajv.compile<B>(props.body);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.params && validators.params) {
      const validation = (ajv as Ajv).validate(validators.params, req.params);
      if (!validation) {
        return next({
          status: 400,
          message: ajv?.errorsText(),
        });
      }
    }

    if (req.query && validators.query) {
      const validation = (ajv as Ajv).validate(validators.query, req.query);
      if (!validation) {
        return next({
          status: 400,
          message: `Request url parameters validation failed: ${(
            ajv as Ajv
          ).errorsText()}`,
        });
      }
    }

    if (req.body && validators.body) {
      const validation = (ajv as Ajv).validate(validators.body, req.body);
      if (!validation) {
        return next({
          status: 400,
          message: `Request body validation failed: ${(
            ajv as Ajv
          ).errorsText()}`,
        });
      }
    }

    next();
  };
};

export default createAjvMiddleware;
