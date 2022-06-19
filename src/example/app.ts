import { InitApp } from '../express';
import type { OpenAPIOptions } from '../openapi';

import controllers from './controllers';

import path from 'path';

const SWAGGER_URLS = ['http://localhost:8000'];
const SWAGGER_PATH = './config/openapi.json';

const openAPIOptions: OpenAPIOptions = {
  title: 'OutQource Node Server',
  version: '0.0.1',
  urls: SWAGGER_URLS,
};

const initApp = new InitApp({
  controllers,
  openAPI: {
    path: path.join(__dirname, SWAGGER_PATH),
    options: openAPIOptions,
    endPoint: '/api-docs',
  },
  sdk: {
    root: './src/example/controllers',
    dest: './src/example/config/test-sdk',
  },
});

export default initApp;
