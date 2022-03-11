import Express, { Application } from "express";
import fs from "fs";

import { createOpenAPI, OpenAPIOptions } from "../../shared";
import {
  json,
  urlencoded,
  cors,
  jsonwebtoken,
  pagination,
  swagger,
} from "../middlewares";

import {
  createRouter,
  createValidators,
  createErrorController,
  createGlobalController,
  IErrorProps,
  IGlobalProps,
} from ".";

const defaultOpenAPIOptions: OpenAPIOptions = {
  title: "outqource-node/express",
  version: "1.0.0",
  urls: ["http://localhost:8000"],
};

export class InitApp {
  public app: Application;
  private controllers: any;
  private openAPI?: {
    path: string;
    options: OpenAPIOptions;
    endPoint: string;
  };

  constructor(props: {
    controllers: any;
    openAPI?: { path: string; options?: OpenAPIOptions; endPoint?: string };
  }) {
    this.app = Express();
    this.controllers = props?.controllers;
    if (props.openAPI?.path) {
      this.openAPI = {
        path: props.openAPI.path,
        options: props.openAPI?.options || defaultOpenAPIOptions,
        endPoint: props.openAPI?.endPoint || "/api-docs",
      };
    }
  }

  public async init() {
    if (this.openAPI) {
      const openAPI = await createOpenAPI(
        this.openAPI.options,
        this.controllers
      );
      await fs.writeFileSync(this.openAPI.path, openAPI);
    }
  }

  public middlewares(
    props?: {
      corsOptions?: cors.CorsOptions;
      jwtUserCallback?: (accessToken: string) => Promise<any>;
    },
    middlewares?: any[] | { before?: any[]; after?: any[] }
  ) {
    const corsOptions = props?.corsOptions;
    const jwtUserCallback = props?.jwtUserCallback;
    // default
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(Express.static("public"));
    this.app.use(cors(corsOptions));

    if (!Array.isArray(middlewares) && middlewares?.before) {
      middlewares.before?.forEach((middleware) => {
        this.app.use(middleware);
      });
    }

    this.app.use(jsonwebtoken(jwtUserCallback));
    this.app.use(pagination());
    if (this.openAPI) {
      this.app.use(this.openAPI.endPoint, ...swagger(this.openAPI.path));
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

  public routers(options?: {
    errorOptions?: IErrorProps;
    globalOptions?: IGlobalProps;
  }) {
    const validators = createValidators(this.controllers);
    createRouter(this.app, this.controllers, validators);
    this.app.use(createErrorController(options?.errorOptions));
    this.app.use(createGlobalController(options?.globalOptions));
  }
}
