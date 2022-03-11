import Express, { Application } from 'express';
import fs from 'fs';

import { createOpenAPI, OpenAPIOptions } from '../../shared';
import { json, urlencoded, cors, jsonwebtoken, pagination, swagger } from '../middlewares';

import {
  createRouter,
  createValidators,
  createErrorController,
  createGlobalController,
  IErrorProps,
  IGlobalProps,
} from '.';

const defaultOpenAPIOptions: OpenAPIOptions = {
  title: 'outqource-node/express',
  version: '1.0.0',
  urls: ['localhost:8000'],
};

export class InitApp {
  public app: Application;
  private openAPIOptions: OpenAPIOptions;
  private controllers: any;
  private openAPIPath: any;

  constructor(openAPIOptions?: OpenAPIOptions) {
    this.app = Express();
    this.openAPIOptions = openAPIOptions ?? defaultOpenAPIOptions;
  }

  public async init(props: { controllers: any; openAPIPath: string }) {
    const { controllers, openAPIPath } = props;
    this.controllers = controllers;
    this.openAPIPath = openAPIPath;

    const openAPI = await createOpenAPI(this.openAPIOptions, controllers);
    await fs.writeFileSync(openAPIPath, openAPI);
  }

  public middlewares(
    {
      corsOptions,
      jwtUserCallback,
      swaggerEndpoint,
    }: {
      corsOptions?: cors.CorsOptions;
      jwtUserCallback?: (accessToken: string) => Promise<any>;
      swaggerEndpoint?: string;
    },
    middlewares?: any[] | { before?: any[]; after?: any[] }
  ) {
    // default
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(Express.static('public'));
    this.app.use(cors(corsOptions));

    if (!Array.isArray(middlewares) && middlewares?.before) {
      middlewares.before?.forEach((middleware) => {
        this.app.use(middleware);
      });
    }

    this.app.use(jsonwebtoken(jwtUserCallback));
    this.app.use(pagination());
    if (this.openAPIPath) {
      this.app.use(swaggerEndpoint || '/api-docs', ...swagger(this.openAPIPath));
    }

    if (Array.isArray(middlewares)) {
      middlewares.forEach((middleware) => {
        this.app.use(middleware);
      });
    }
    if (!Array.isArray(middlewares) && middlewares?.after) {
      middlewares.after?.forEach((middleware) => {
        this.app.use(middleware);
      });
    }
  }

  public routers(options?: { errorOptions?: IErrorProps; globalOptions?: IGlobalProps }) {
    const validators = createValidators(this.controllers);
    createRouter(this.app, this.controllers, validators);
    this.app.use(createErrorController(options?.errorOptions));
    this.app.use(createGlobalController(options?.globalOptions));
  }
}
