import type { Request, Response, NextFunction } from 'express';
import type { PrismaClient } from '@prisma/client';
import type { ControllerAPI } from '../openapi';
export declare type PrismaAction =
  | 'findUnique'
  | 'findMany'
  | 'findFirst'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'queryRaw'
  | 'aggregate'
  | 'count';
declare type NoUndefinedField<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
declare type TrueKeyObject<T, V extends string> = T extends Record<string, any>
  ? T[V] extends undefined
    ? false
    : Record<V, T[V]>
  : false;
declare type Keys<T> = T extends string ? `${T}` : never;
declare type EveryKeyword<T> = T extends string
  ? `$param` | `$query` | `$param/${T}` | `$query/${T}` | `$body/${T}`
  : never;
export declare type PrismaOption<T> = {
  [K in keyof T]: T[K] extends object | undefined
    ? TrueKeyObject<NoUndefinedField<T>, 'where'> extends Record<infer S, any>
      ? TrueKeyObject<NoUndefinedField<T>, 'where'>[S] extends T[K]
        ? {
            [U in keyof TrueKeyObject<NoUndefinedField<T>, 'where'>[S]]: `${EveryKeyword<Keys<U>>}` | null;
          }
        : TrueKeyObject<NoUndefinedField<T>, 'select' | 'include'> extends Record<infer S, any>
        ? TrueKeyObject<NoUndefinedField<T>, 'select' | 'include'>[S] extends T[K]
          ? {
              [U in keyof TrueKeyObject<NoUndefinedField<T>, 'select' | 'include'>[S]]: boolean | null;
            }
          : TrueKeyObject<NoUndefinedField<T>, 'data'> extends Record<infer S, any>
          ? TrueKeyObject<NoUndefinedField<T>, 'data'>[S] extends T[K]
            ? {
                [U in keyof TrueKeyObject<NoUndefinedField<T>, 'data'>[S]]: `$value/${Keys<U>}` | null;
              }
            : unknown
          : unknown
        : unknown
      : unknown
    : T[K];
};
export declare type CreatePrismaControllerOptions<T = any> = {
  table: string;
  actions: PrismaAction[] | PrismaAction;
  pagination?: boolean;
  response?: boolean;
  softDelete?: string | string[];
  options: PrismaOption<T>;
};
export declare const createPrismaController: <T = any>(
  database: PrismaClient,
  controllerAPI: ControllerAPI,
  options: CreatePrismaControllerOptions<T>,
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
