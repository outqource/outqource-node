import { ControllerAPI } from './types';

const getOpenAPIPath = (api: ControllerAPI) => {
  const path = api.path
    .split('/')
    .map(pathItem => {
      if (pathItem.indexOf(':') > -1) {
        return `{${pathItem.replace(':', '')}}`;
      }
      return pathItem;
    })
    .join('/');

  return path;
};

export default getOpenAPIPath;
