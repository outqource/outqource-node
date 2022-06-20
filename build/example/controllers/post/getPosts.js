'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPosts = exports.getPostsAPI = void 0;
const axios_1 = __importDefault(require('axios'));
exports.getPostsAPI = {
  path: '/posts',
  method: 'GET',
};
const getPosts = async (req, res, next) => {
  try {
    const response = await axios_1.default.get('https://jsonplaceholder.typicode.com/posts');
    res.status(200).json({
      posts: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
exports.getPosts = getPosts;
