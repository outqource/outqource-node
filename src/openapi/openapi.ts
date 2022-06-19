import type { OpenAPIOptions, ControllerAPI } from './types';

import getOpenAPI from './getOpenAPI';
import getOpenAPITags from './getOpenAPITags';
import getOpenAPIPath from './getOpenAPIPath';
import getOpenAPIPathSummary from './getOpenAPIPathSummary';
import getOpenAPIPathSecurity from './getOpenAPIPathSecurity';
import getOpenAPIPathParameters from './getOpenAPIPathParameters';
import getOpenAPIPathRequestBody from './getOpenAPIPathRequestBody';
import getOpenAPIPathResponses from './getOpenAPIPathResponses';

const getOpenAPIPaths = (controllers: Record<string, any>) => {
  const paths: any = {};
  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf('API') > -1) {
      const api = value as ControllerAPI;
      const name = key.replace('API', '');

      const path = getOpenAPIPath(api);
      const summary = getOpenAPIPathSummary(api, name);
      const security = getOpenAPIPathSecurity(api);
      const parameters = getOpenAPIPathParameters(api);
      const requestBody = getOpenAPIPathRequestBody(api);
      const responses = getOpenAPIPathResponses(api);

      paths[path] = {
        ...paths[path],
        [api.method.toLowerCase()]: {
          tags: api.tags || [],
          summary,
          security,
          parameters,
          responses,
          requestBody,
        },
      };
    }
  });

  return paths;
};

const createOpenAPI = async (
  { title, version, urls }: OpenAPIOptions,
  controllers: any,
): Promise<string> => {
  const tags = getOpenAPITags(controllers);
  const paths = getOpenAPIPaths(controllers);
  const result = getOpenAPI({ title, version, urls, tags, paths });

  return JSON.stringify(result);
};

export default createOpenAPI;
