/// <reference types="node" />
import type { URL } from 'url';
export declare type OpenAPIOptions = {
  title: string;
  version: string;
  urls: string[];
};
export declare type ControllerAPIMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PATCH'
  | 'PUT';
export declare type ControllerAPIMethodLowerCase =
  | 'get'
  | 'post'
  | 'delete'
  | 'patch'
  | 'put';
export declare type ControllerAPIResponsStatusCode =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 404
  | 500;
export declare type ControllerAPIResponse =
  | ControllerAPIResponsStatusCode
  | {
      status: ControllerAPIResponsStatusCode;
      message?: string;
      exampleContentType?: string;
      example?: object;
    };
export declare type ControllerAPIResponses = Array<ControllerAPIResponse>;
export declare type ControllerAPI = {
  tags?: string[];
  path: string;
  method: ControllerAPIMethod;
  middlewares?: Array<any>;
  param?: ValidatorItem[];
  query?: ValidatorItem[];
  header?: ValidatorItem[];
  body?: ValidatorItem[];
  auth?: 'jwt' | 'cookie' | 'session';
  summary?: string;
  formData?: {
    key: string;
    type: 'single' | 'multiple';
  };
  responses?: ControllerAPIResponses;
};
export declare type ValidatorKey = 'param' | 'query' | 'header' | 'body';
export declare type ValidationItemType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'file'
  | 'none';
export declare type ValidatorItem = {
  key: string;
  type: ValidationItemType;
  nullable?: boolean;
  default?: any;
  example?: any;
};
export interface OpenAPI3 {
  openapi: string;
  paths?: Record<string, PathItemObject>;
  info: {
    title: string;
    version: string;
  };
  servers: Array<{
    url: string;
  }>;
  components?: {
    schemas?: Record<string, ReferenceObject | SchemaObject>;
    responses?: Record<string, ReferenceObject | ResponseObject>;
    parameters?: Record<string, ReferenceObject | ParameterObject>;
    requestBodies?: Record<string, ReferenceObject | RequestBody>;
    headers?: Record<string, ReferenceObject | HeaderObject>;
    links?: Record<string, ReferenceObject | LinkObject>;
    securitySchemes?: Record<string, any>;
  };
  tags: Array<{
    name: string;
  }>;
}
export declare type Headers = Record<string, string>;
export interface HeaderObject {
  type?: string;
  description?: string;
  required?: boolean;
  schema: ReferenceObject | SchemaObject;
}
export interface PathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  parameters?: (ReferenceObject | ParameterObject)[];
}
export interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: (ReferenceObject | ParameterObject)[];
  requestBody?: RequestBody;
  description?: string;
}
export interface OperationObject {
  description?: string;
  tags?: string[];
  summary?: string;
  operationId?: string;
  parameters?: (ReferenceObject | ParameterObject)[];
  requestBody?: ReferenceObject | RequestBody;
  responses?: Record<string, ReferenceObject | ResponseObject>;
}
export interface ParameterObject {
  name?: string;
  in?:
    | 'query'
    | 'header'
    | 'path'
    | /* V3 */ 'cookie'
    | /* V2 */ 'formData'
    | /* V2 */ 'body';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: ReferenceObject | SchemaObject;
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'file';
  items?: ReferenceObject | SchemaObject;
  enum?: string[];
}
export declare type ReferenceObject = {
  $ref: string;
};
export interface ResponseObject {
  description?: string;
  headers?: Record<string, ReferenceObject | HeaderObject>;
  schema?: ReferenceObject | SchemaObject;
  links?: Record<string, ReferenceObject | LinkObject>;
  content?: {
    [contentType: string]: {
      schema: ReferenceObject | SchemaObject;
    };
  };
}
export interface RequestBody {
  description?: string;
  content?: {
    [contentType: string]: {
      schema: ReferenceObject | SchemaObject;
    };
  };
}
export interface SchemaObject {
  title?: string;
  description?: string;
  required?: string[];
  enum?: string[];
  type?: string;
  items?: ReferenceObject | SchemaObject;
  allOf?: SchemaObject;
  properties?: Record<string, ReferenceObject | SchemaObject>;
  default?: any;
  additionalProperties?: boolean | ReferenceObject | SchemaObject;
  nullable?: boolean;
  oneOf?: (ReferenceObject | SchemaObject)[];
  anyOf?: (ReferenceObject | SchemaObject)[];
  format?: string;
}
export declare type SchemaFormatter = (
  schemaObj: SchemaObject,
) => string | undefined;
export interface SwaggerToTSOptions {
  /** Allow arbitrary properties on schemas (default: false) */
  additionalProperties?: boolean;
  /** (optional) Specify auth if using openapi-typescript to fetch URL */
  auth?: string;
  /** (optional) Specify current working directory (cwd) to resolve remote schemas on disk (not needed for remote URL schemas) */
  cwd?: URL;
  /** Specify a formatter */
  formatter?: SchemaFormatter;
  /** Generates immutable types (readonly properties and readonly array) */
  immutableTypes?: boolean;
  /** (optional) Treat schema objects with default values as non-nullable */
  defaultNonNullable?: boolean;
  /** (optional) Path to Prettier config */
  prettierConfig?: string;
  /** (optional) Parsing input document as raw schema rather than OpenAPI document */
  rawSchema?: boolean;
  /** (optional) Should logging be suppressed? (necessary for STDOUT) */
  silent?: boolean;
  /** (optional) OpenAPI version. Must be present if parsing raw schema */
  version?: number;
  /**
   * (optional) List of HTTP headers that will be sent with the fetch request to a remote schema. This is
   * in addition to the authorization header. In some cases, servers require headers such as Accept: application/json
   * or Accept: text/yaml to be sent in order to figure out how to properly fetch the OpenAPI/Swagger document as code.
   * These headers will only be sent in the case that the schema URL protocol is of type http or https.
   */
  httpHeaders?: Headers;
  /**
   * HTTP verb used to fetch the schema from a remote server. This is only applied
   * when the schema is a string and has the http or https protocol present. By default,
   * the request will use the HTTP GET method to fetch the schema from the server.
   *
   * @default {string} GET
   */
  httpMethod?: string;
}
/** Context passed to all submodules */
export interface GlobalContext {
  additionalProperties: boolean;
  auth?: string;
  formatter?: SchemaFormatter;
  immutableTypes: boolean;
  defaultNonNullable: boolean;
  /** (optional) Should logging be suppressed? (necessary for STDOUT) */
  silent?: boolean;
  namespace?: string;
  rawSchema: boolean;
  version: number;
}
