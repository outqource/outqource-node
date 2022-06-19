import type { OpenAPIOptions } from './types';
declare const createOpenAPI: ({ title, version, urls }: OpenAPIOptions, controllers: any) => Promise<string>;
export default createOpenAPI;
