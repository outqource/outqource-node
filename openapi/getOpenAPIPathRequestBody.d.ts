import { ControllerAPI } from './types';
declare const getOpenAPIPathRequestBody: (api: ControllerAPI) =>
  | {
      content: {
        'application/json': {
          schema: {
            type: string;
            example: Record<string, any>;
          };
        };
      };
    }
  | {
      content: {
        'multipart/form-data': {
          schema: {
            type: string;
            properties: {
              [x: string]: any;
            };
          };
        };
      };
    }
  | null;
export default getOpenAPIPathRequestBody;
