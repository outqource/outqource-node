'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const sdk_1 = __importDefault(require('../sdk'));
const getOpenAPI_1 = __importDefault(require('./getOpenAPI'));
const getOpenAPITags_1 = __importDefault(require('./getOpenAPITags'));
const getOpenAPIPath_1 = __importDefault(require('./getOpenAPIPath'));
const getOpenAPIPathSummary_1 = __importDefault(require('./getOpenAPIPathSummary'));
const getOpenAPIPathSecurity_1 = __importDefault(require('./getOpenAPIPathSecurity'));
const getOpenAPIPathParameters_1 = __importDefault(require('./getOpenAPIPathParameters'));
const getOpenAPIPathRequestBody_1 = __importDefault(require('./getOpenAPIPathRequestBody'));
const getOpenAPIPathResponses_1 = __importDefault(require('./getOpenAPIPathResponses'));
const getOpenAPIPaths = async controllers => {
  const paths = {};
  const sdk = await (0, sdk_1.default)('./src/example/controllers', './src/example/config/test-sdk');
  Object.entries(controllers).forEach(([key, value]) => {
    if (key.indexOf('API') > -1) {
      const api = value;
      const name = key.replace('API', '');
      let description = api.description ? `# ${name}\n${api.description}` : `# ${name}`;
      if (sdk[name]) {
        description = description + `\n\`\`\`ts\n${sdk[name]}\n\`\`\``;
      }
      const path = (0, getOpenAPIPath_1.default)(api);
      const summary = (0, getOpenAPIPathSummary_1.default)(api, name);
      const security = (0, getOpenAPIPathSecurity_1.default)(api);
      const parameters = (0, getOpenAPIPathParameters_1.default)(api);
      const requestBody = (0, getOpenAPIPathRequestBody_1.default)(api);
      const responses = (0, getOpenAPIPathResponses_1.default)(api);
      paths[path] = {
        ...paths[path],
        [api.method.toLowerCase()]: {
          tags: api.tags || [],
          summary,
          description,
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
const createOpenAPI = async ({ title, version, urls }, controllers) => {
  const tags = (0, getOpenAPITags_1.default)(controllers);
  const paths = await getOpenAPIPaths(controllers);
  const result = (0, getOpenAPI_1.default)({ title, version, urls, tags, paths });
  return JSON.stringify(result);
};
exports.default = createOpenAPI;
