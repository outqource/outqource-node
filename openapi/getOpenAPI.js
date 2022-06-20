'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const getOpenAPI = ({ title, version, urls, tags, paths }) => ({
  openapi: '3.0.0',
  info: {
    title,
    version,
  },
  servers: urls.map(url => ({ url })),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags,
  paths,
});
exports.default = getOpenAPI;
