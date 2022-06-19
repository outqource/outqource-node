import { ControllerAPI } from './types';

const getOpenAPIPathSummary = (api: ControllerAPI, name: string) => {
  return api.summary ? `${api.summary} [${name}]` : `function ${name}`;
};

export default getOpenAPIPathSummary;
