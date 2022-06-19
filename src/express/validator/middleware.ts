import { Request, Response, NextFunction } from "express";
import Ajv, {JSONSchemaType, Options, ValidateFunction} from "ajv";

export type CreateAJVMiddlewareProps<P, Q, B> = {
  params?: JSONSchemaType<P>;
  query?: JSONSchemaType<Q>;
  body?: JSONSchemaType<B>;
};

export type AjvValidators<P, Q, B> = {
  params?: ValidateFunction<P>;
  query?: ValidateFunction<Q>;
  body?: ValidateFunction<B>;
};

const createAjvMiddleware = <P, Q, B>(
  props?: CreateAJVMiddlewareProps<P, Q, B>
) => {
  if (!props) props = {};

  const ajv: Ajv = (() => {
    const options: Options = {};

    if (props.params)
        options.coerceTypes = true;

    return new Ajv(options);
  })();

  const validators: AjvValidators<P, Q, B> = {};

  if (props.params) {
    validators.params = ajv.compile<P>(props.params);
  }

  if (props.query) {
    validators.query = ajv.compile<Q>(props.query);
  }

  if (props.body) {
    validators.body = ajv.compile<B>(props.body);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.params && validators.params) {
      const validation = ajv.validate(validators.params, req.params);
      if (!validation) {
        return next({
          status: 400,
          message: ajv.errorsText(),
        });
      }
    }

    if (req.query && validators.query) {
      const validation = ajv.validate(validators.query, req.query);
      if (!validation) {
        return next({
          status: 400,
          message: `Request url parameters validation failed: ${ajv.errorsText()}`,
        });
      }
    }

    if (req.body && validators.body) {
      const validation = ajv.validate(validators.body, req.body);
      if (!validation) {
        return next({
          status: 400,
          message: `Request body validation failed: ${ajv.errorsText()}`,
        });
      }
    }

    next();
  };
};

export default createAjvMiddleware;
