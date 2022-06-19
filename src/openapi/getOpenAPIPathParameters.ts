import { ControllerAPI } from './types';

const getOpenAPIPathParameters = (api: ControllerAPI) => {
  const parameters: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema: {
      type: string;
    };
  }> = [];

  if (Array.isArray(api.param)) {
    api.param.forEach(item => {
      parameters.push({
        name: item.key,
        in: 'path',
        required: !item.nullable && !item.default,
        description: item.example || item.default || item.key,
        schema: {
          type: Array.isArray(item.type) ? item.type[0] : item.type,
        },
      });
    });
  }

  if (Array.isArray(api.query)) {
    api.query.forEach(item => {
      parameters.push({
        name: item.key,
        in: 'query',
        required: !item.nullable && !item.default,
        description: item.example || item.default || item.key,
        schema: {
          type: item.type === 'array' ? 'array' : item.type,
        },
      });
    });
  }

  return parameters;
};

export default getOpenAPIPathParameters;
