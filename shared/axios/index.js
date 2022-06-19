'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.onRequest = void 0;
const axios_1 = __importDefault(require('axios'));
const query_string_1 = __importDefault(require('query-string'));
const onRequest = async ({ instance = axios_1.default, url, method, query, data, headers }) => {
  try {
    if (query) {
      url = `${url}?${query_string_1.default.stringify(query)}`;
    }
    return await instance({
      method,
      url,
      data,
      headers,
    });
  } catch (error) {
    const e = error;
    return e;
  }
};
exports.onRequest = onRequest;
