import { OpenAPI3, OpenAPIOptions } from './types';
interface GetOpenAPIProps extends OpenAPIOptions {
  tags: any[];
  paths: any;
}
declare const getOpenAPI: ({ title, version, urls, tags, paths }: GetOpenAPIProps) => OpenAPI3;
export default getOpenAPI;
