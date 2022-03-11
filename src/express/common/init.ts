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
  urls: ["localhost:8000"],
};

export default class App {
  public app: Application;
  private openAPIOptions: OpenAPIOptions;

  constructor(openAPIOptions?: OpenAPIOptions) {
    this.app = Express();
    this.openAPIOptions = openAPIOptions ?? defaultOpenAPIOptions;
  }

  public async init({
    controllers,
    openAPIPath,
  }: {
    controllers: any;
    openAPIPath: string;
  }) {
    const openAPI = await createOpenAPI(this.openAPIOptions, controllers);
    await fs.writeFileSync(openAPIPath, openAPI);
  }

  public middlewares(
    {
      corsOptions,
      jwtUserCallback,
      swaggerConfigPath,
      swaggerEndpoint,
    }: {
      corsOptions?: cors.CorsOptions;
      jwtUserCallback?: (accessToken: string) => Promise<any>;
      swaggerConfigPath?: string;
      swaggerEndpoint?: string;
    },
    middlewares?: any[]
  ) {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(Express.static("public"));
    this.app.use(cors(corsOptions));
    this.app.use(jsonwebtoken(jwtUserCallback));
    this.app.use(pagination());

    if (swaggerConfigPath) {
      this.app.use(
        swaggerEndpoint || "/api-docs",
        ...swagger(swaggerConfigPath)
      );
    }

    if (middlewares) {
      middlewares.forEach((middleware) => {
        this.app.use(middleware);
      });
    }
  }

  public routers(
    controllers: any,
    options?: { errorOptions?: IErrorProps; globalOptions?: IGlobalProps }
  ) {
    const validators = createValidators(controllers);
    createRouter(this.app, controllers, validators);
    this.app.use(createErrorController(options?.errorOptions));
    this.app.use(createGlobalController(options?.globalOptions));
  }
}
