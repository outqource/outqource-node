'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const constant_1 = require('./constant');
const getOpenAPIPathResponses = api => {
  const responses = {
    500: {
      description: constant_1.OPEN_API_RESPONSES[500],
      content: {
        'application/json': {},
      },
    },
  };
  if (Array.isArray(api.responses)) {
    api.responses.forEach(item => {
      if (typeof item === 'number') {
        const statusCode = item;
        responses[statusCode] = {
          description: constant_1.OPEN_API_RESPONSES[statusCode],
          content: {
            'application/json': {},
          },
        };
      } else {
        const {
          status,
          message = constant_1.OPEN_API_RESPONSES[item.status],
          exampleContentType = 'application/json',
          example = {},
        } = item;
        const content = { [exampleContentType]: {} };
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
      description: constant_1.OPEN_API_RESPONSES[200],
      content: {
        'application/json': {},
      },
    };
  }
  return responses;
};
exports.default = getOpenAPIPathResponses;
