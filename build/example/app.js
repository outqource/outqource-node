'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('../express');
const controllers_1 = __importDefault(require('./controllers'));
const path_1 = __importDefault(require('path'));
const SWAGGER_URLS = ['http://localhost:8000'];
const SWAGGER_PATH = './config/openapi.json';
const openAPIOptions = {
  title: 'OutQource Node Server',
  version: '0.0.1',
  urls: SWAGGER_URLS,
};
const initApp = new express_1.InitApp({
  controllers: controllers_1.default,
  openAPI: {
    path: path_1.default.join(__dirname, SWAGGER_PATH),
    options: openAPIOptions,
    endPoint: '/api-docs',
  },
});
exports.default = initApp;
