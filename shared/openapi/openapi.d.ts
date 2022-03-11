import type { OpenAPIOptions } from "./types";
export declare const createOpenAPI: ({ title, version, urls }: OpenAPIOptions, controllers: any) => Promise<string>;
