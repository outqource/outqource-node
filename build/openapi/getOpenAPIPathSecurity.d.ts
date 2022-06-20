import { ControllerAPI } from './types';
declare const getOpenAPIPathSecurity: (api: ControllerAPI) => {
  bearerAuth: never[];
}[];
export default getOpenAPIPathSecurity;
