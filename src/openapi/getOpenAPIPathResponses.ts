import {
  ControllerAPI,
  ControllerAPIResponse,
  ControllerAPIResponsStatusCode,
} from './types';
import { OPEN_API_RESPONSES } from './constant';

const getOpenAPIPathResponses = (api: ControllerAPI) => {
  const responses: any = {
    500: {
      description: OPEN_API_RESPONSES[500],
      content: {
        'application/json': {},
      },
    },
  };

  if (Array.isArray(api.responses)) {
    api.responses.forEach((item: ControllerAPIResponse) => {
      if (typeof item === 'number') {
        const statusCode = item as ControllerAPIResponsStatusCode;
        responses[statusCode] = {
          description: OPEN_API_RESPONSES[statusCode] as string,
          content: {
            'application/json': {},
          },
        };
      } else {
        const {
          status,
          message = OPEN_API_RESPONSES[item.status],
          exampleContentType = 'application/json',
          example = {},
        } = item;
        const content: any = { [exampleContentType]: {} };
        if (example) {
          content[exampleContentType].example = example;
        }

        responses[status] = {
          description: message,
          content,
        };
      }
    });
  } else {
    responses[200] = {
      description: OPEN_API_RESPONSES[200],
      content: {
        'application/json': {},
      },
    };
  }

  return responses;
};

export default getOpenAPIPathResponses;
