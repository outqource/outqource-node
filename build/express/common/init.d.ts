import { Application } from "express";
import { OpenAPIOptions } from "../../shared";
import { cors } from "../middlewares";
import { IErrorProps, IGlobalProps } from ".";
export declare class InitApp {
    app: Application;
    private openAPIOptions;
    constructor(openAPIOptions?: OpenAPIOptions);
    init({ controllers, openAPIPath, }: {
        controllers: any;
        openAPIPath: string;
    }): Promise<void>;
    middlewares({ corsOptions, jwtUserCallback, swaggerConfigPath, swaggerEndpoint, }: {
        corsOptions?: cors.CorsOptions;
        jwtUserCallback?: (accessToken: string) => Promise<any>;
        swaggerConfigPath?: string;
        swaggerEndpoint?: string;
    }, middlewares?: any[]): void;
    routers(controllers: any, options?: {
        errorOptions?: IErrorProps;
        globalOptions?: IGlobalProps;
    }): void;
}
