import Express, { Application } from 'express';
import fs from 'fs';

import { createOpenAPI, OpenAPIOptions } from '../../shared';
import { json, urlencoded, cors, jsonwebtoken, pagination, swagger } from '../middlewares';

import { createRouter, errorController, globalController, IErrorProps, IGlobalProps, ExpressController } from '.';
import Validator from '../validator';

const defaultOpenAPIOptions: OpenAPIOptions = {
  title: 'outqource-node/express',
  version: '1.0.0',
  urls: ['http://localhost:8000'],
};

type InitAppOpenAPI = {
  path: string;
  options?: OpenAPIOptions;
  endPoint?: string;
};

export interface InitAppProps {
  controllers: Record<string, any>;
  openAPI?: InitAppOpenAPI;
}

export class InitApp {
  public app: Application;
  private controllers: any;
  private openAPI?: InitAppOpenAPI;

  constructor(props: InitAppProps) {
    this.app = Express();
    this.controllers = props?.controllers;

    if (props.openAPI?.path) {
      this.openAPI = {
        path: props.openAPI.path,
        options: props.openAPI?.options || defaultOpenAPIOptions,
        endPoint: props.openAPI?.endPoint || '/api-docs',
      };
    }
  }

  public async init() {
    if (this.openAPI) {
      const openAPI = await createOpenAPI(this.openAPI.options as OpenAPIOptions, this.controllers);
      await fs.writeFileSync(this.openAPI.path, openAPI);
    }
  }

  public applyMiddlewares(middlewares?: ExpressController[]) {
    if (!middlewares || !Array.isArray(middlewares) || middlewares.length === 0) {
      return;
    }

    middlewares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  public middlewares(
    middlewares?: ExpressController[] | { before?: ExpressController[]; after?: ExpressController[] },
    props?: {
      corsOptions?: cors.CorsOptions;
      jwtUserCallback?: (accessToken: string) => Promise<any>;
    },
  ) {
    const corsOptions = props?.corsOptions;
    const jwtUserCallback = props?.jwtUserCallback;

    // default
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(Express.static('public'));
    this.app.use(cors(corsOptions));
    this.app.use(pagination());

    if (!Array.isArray(middlewares) && middlewares?.before) {
      this.applyMiddlewares(middlewares.before);
    }

    if (jwtUserCallback) {
      this.app.use(jsonwebtoken(jwtUserCallback));
    }

    if (this.openAPI) {
      this.app.use(this.openAPI.endPoint as string, ...swagger(this.openAPI.path));
    }

    if (Array.isArray(middlewares)) {
      this.applyMiddlewares(middlewares);
    }

    if (!Array.isArray(middlewares) && middlewares?.after) {
      this.applyMiddlewares(middlewares.after);
    }
  }

  public routers(options?: { errorOptions?: IErrorProps; globalOptions?: IGlobalProps }) {
    const validator = Validator.create(this.controllers);
    createRouter(this.app, this.controllers, validator);

    this.app.use(errorController(options?.errorOptions));
    this.app.use(globalController(options?.globalOptions));
  }
}
