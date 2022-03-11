import { Application } from "express";
import { OpenAPIOptions } from "../../shared";
import { cors } from "../middlewares";
import { IErrorProps, IGlobalProps } from ".";
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
    middlewares(props?: {
        corsOptions?: cors.CorsOptions;
        jwtUserCallback?: (accessToken: string) => Promise<any>;
    }, middlewares?: any[] | {
        before?: any[];
        after?: any[];
    }): void;
    routers(options?: {
        errorOptions?: IErrorProps;
        globalOptions?: IGlobalProps;
    }): void;
}
