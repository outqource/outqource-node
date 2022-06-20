'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const getOpenAPIPath = api => {
  const path = api.path
    .split('/')
    .map(pathItem => {
      if (pathItem.indexOf(':') > -1) {
        return `{${pathItem.replace(':', '')}}`;
      }
      return pathItem;
    })
    .join('/');
  return path;
};
exports.default = getOpenAPIPath;
