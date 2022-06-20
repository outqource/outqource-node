import { Request, Response, NextFunction } from 'express';
import Ajv, { ErrorObject, JSONSchemaType, Options, ValidateFunction } from 'ajv';
import type { JTDDataType } from 'ajv/dist/jtd';
import { ControllerAPI, ValidatorItem } from '../../openapi';

export { Ajv };
export type { JSONSchemaType, JTDDataType };

type UnknownSchemaType = JSONSchemaType<Record<string, any>>;

export type CreateMiddlewareProps<P, Q, B> = {
  param?: JSONSchemaType<P> | UnknownSchemaType;
  query?: JSONSchemaType<Q> | UnknownSchemaType;
  body?: JSONSchemaType<B> | UnknownSchemaType;
};

export type ValidatorMiddleware<P, Q, B> = {
  param?: ValidateFunction<P>;
  query?: ValidateFunction<Q>;
  body?: ValidateFunction<B>;
};

export default class Validator {
  readonly controllers: Record<string, any> = {};

  public validators: Record<string, any> = {};
  public middlewares: Record<string, any> = {};

  constructor(controllers: Record<string, any>) {
    this.controllers = controllers;
  }

  public static create(controllers: Record<string, any>) {
    const instance = new Validator(controllers);
    return instance._create();
  }

  public _create() {
    Object.entries(this.controllers).forEach(([key, value]: [string, ControllerAPI | any]) => {
      if (key.includes('API')) {
        const name = key.replace('API', '');
        const apiValidators: CreateMiddlewareProps<any, any, any> = {};

        Object.entries(value).forEach(([key, value]: [string, any]) => {
          if (key === 'param' || key === 'query' || key === 'body') {
            const validator = this.createValidators(value as ValidatorItem[]);
            apiValidators[key] = validator;
          }
        });

        const middlewares = this.createMiddleware(apiValidators);
        this.middlewares[name] = [middlewares];
      }
    });

    return this.middlewares;
  }

  public createValidators(validatorItems: ValidatorItem[]): UnknownSchemaType {
    const validator: UnknownSchemaType = {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    };

    validatorItems.forEach(validatorItem => {
      const { key, type } = validatorItem;

      if (type === 'string' || type === 'number' || type === 'boolean') {
        (validator as UnknownSchemaType).properties[key] = { type };
      }

      if (validatorItem.type === 'array' && validatorItem.items) {
        (validator as UnknownSchemaType).properties[key] = {
          type,
          items: this.createChildValidators(validatorItem.items),
        };
      }

      if (!validatorItem.nullable) {
        (validator as UnknownSchemaType).required.push(key);
      }
    });

    return validator;
  }

  public createChildValidators(validatorItems: string | ValidatorItem[]): any {
    if (typeof validatorItems === 'string') {
      if (validatorItems === 'string' || validatorItems === 'number' || validatorItems === 'boolean') {
        return { type: validatorItems };
      }
    }

    if (Array.isArray(validatorItems)) {
      const validator: UnknownSchemaType = {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      };

      validatorItems.forEach(validatorItem => {
        const { key, type } = validatorItem;

        if (type === 'string' || type === 'number' || type === 'boolean') {
          (validator as UnknownSchemaType).properties[key] = { type };
        }

        if (validatorItem.type === 'array' && validatorItem.items) {
          (validator as UnknownSchemaType).properties[key] = {
            type,
            items: this.createChildValidators(validatorItem.items),
          };
        }

        if (!validatorItem.nullable) {
          (validator as UnknownSchemaType).required.push(key);
        }
      });

      return validator;
    }

    return {};
  }

  public createMiddleware<P, Q, B>(props?: CreateMiddlewareProps<P, Q, B>) {
    if (!props) props = {};

    const ajv: Ajv = (() => {
      const options: Options = {};

      if (props.param) options.coerceTypes = true;

      return new Ajv(options);
    })();

    const validators: ValidatorMiddleware<P, Q, B> = {};

    if (props.param) {
      validators.param = ajv.compile<P>(props.param);
    }

    if (props.query) {
      validators.query = ajv.compile<Q>(props.query);
    }

    if (props.body) {
      validators.body = ajv.compile<B>(props.body);
    }

    return (req: Request, res: Response, next: NextFunction) => {
      let errorMessage = '';

      if (req.params && validators.param) {
        const validation = validators.param(req.params);
        errorMessage = this.getErrorMessage(validators.param.errors) ?? '';

        if (!validation) {
          return next({
            status: 400,
            message: `Request url parameters validation failed: ${errorMessage}`,
          });
        }
      }

      if (req.query && validators.query) {
        const validation = validators.query(req.query);
        errorMessage = this.getErrorMessage(validators.query.errors) ?? '';

        if (!validation) {
          return next({
            status: 400,
            message: `Request query parameters validation failed: ${errorMessage}`,
          });
        }
      }

      if (req.body && validators.body) {
        const validation = validators.body(req.body);
        errorMessage = this.getErrorMessage(validators.body.errors) ?? '';

        if (!validation) {
          return next({
            status: 400,
            message: `Request body validation failed: ${errorMessage}`,
          });
        }
      }

      next();
    };
  }

  public getErrorMessage(errors?: ErrorObject[] | null): string | undefined {
    if (!errors) return undefined;
    return errors?.map(error => `${error.instancePath.replace('/', '')} - ${error.message}`).join(', ') ?? '';
  }
}
