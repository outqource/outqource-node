import { Request, Response, NextFunction } from 'express';
import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import type { JTDDataType } from 'ajv/dist/jtd';
import { ValidatorItem } from '../../openapi';
export { Ajv };
export type { JSONSchemaType, JTDDataType };
declare type UnknownSchemaType = JSONSchemaType<Record<string, any>>;
export declare type CreateMiddlewareProps<P, Q, B> = {
  param?: JSONSchemaType<P> | UnknownSchemaType;
  query?: JSONSchemaType<Q> | UnknownSchemaType;
  body?: JSONSchemaType<B> | UnknownSchemaType;
};
export declare type ValidatorMiddleware<P, Q, B> = {
  param?: ValidateFunction<P>;
  query?: ValidateFunction<Q>;
  body?: ValidateFunction<B>;
};
export default class Validator {
  readonly controllers: Record<string, any>;
  validators: Record<string, any>;
  middlewares: Record<string, any>;
  constructor(controllers: Record<string, any>);
  static create(controllers: Record<string, any>): Record<string, any>;
  static parseObjectValues(object: any): any;
  _create(): Record<string, any>;
  createValidators(validatorItems: ValidatorItem[]): UnknownSchemaType;
  createChildValidators(validatorItems: string | ValidatorItem[]): any;
  createMiddleware<P, Q, B>(
    props?: CreateMiddlewareProps<P, Q, B>,
  ): (req: Request, res: Response, next: NextFunction) => void;
  getErrorMessage(errors?: ErrorObject[] | null): string | undefined;
}
