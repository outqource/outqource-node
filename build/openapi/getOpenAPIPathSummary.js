'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const getOpenAPIPathSummary = (api, name) => {
  return api.summary ? `${api.summary} [${name}]` : `function ${name}`;
};
exports.default = getOpenAPIPathSummary;
