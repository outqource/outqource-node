import { Application } from 'express';
import { OpenAPIOptions } from '../../shared';
import { cors } from '../middlewares';
import { IErrorProps, IGlobalProps, ExpressController } from '.';
export declare class InitApp {
  app: Application;
  private controllers;
  private openAPI?;
  constructor(props: {
    controllers: any;
    openAPI?: {
      path: string;
      options?: OpenAPIOptions;
      endPoint?: string;
    };
  });
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
