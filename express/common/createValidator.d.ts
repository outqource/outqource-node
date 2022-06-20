import { Request, Response, NextFunction } from 'express';
import * as ValidatorMethod from 'express-validator';
import type { ValidatorKey, ValidatorItem } from '../../shared';
export declare const validator: (req: Request, _: Response, next: NextFunction) => void;
export declare const validatorWrapper: (...props: any[]) => any[];
export declare const createValidation: (method: any, type: string) => any;
export declare const createValidator: (key: ValidatorKey, api: ValidatorItem) => ValidatorMethod.ValidationChain;
export declare const createValidators: (controllers: Record<string, any>) => Record<string, any>;
