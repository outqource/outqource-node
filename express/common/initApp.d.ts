import { Application } from 'express';
import { OpenAPIOptions } from '../../shared';
import { cors } from '../middlewares';
import { IErrorProps, IGlobalProps, ExpressController } from '.';
declare type InitAppOpenAPI = {
  path: string;
  options?: OpenAPIOptions;
  endPoint?: string;
};
declare type InitAppSDK = {
  root?: string;
  dest?: string;
};
export interface InitAppProps {
  controllers: Record<string, any>;
  openAPI?: InitAppOpenAPI;
  sdk?: InitAppSDK;
}
export declare class InitApp {
  app: Application;
  private controllers;
  private openAPI?;
  private sdk?;
  constructor(props: InitAppProps);
  init(): Promise<void>;
  applyMiddlewares(middlewares?: ExpressController[]): void;
  middlewares(
    middlewares?:
      | ExpressController[]
      | {
          before?: ExpressController[];
          after?: ExpressController[];
        },
    props?: {
      corsOptions?: cors.CorsOptions;
      jwtUserCallback?: (accessToken: string) => Promise<any>;
    },
  ): void;
  routers(options?: { errorOptions?: IErrorProps; globalOptions?: IGlobalProps }): void;
}
export {};
