'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPost = exports.getPostAPI = void 0;
const axios_1 = __importDefault(require('axios'));
exports.getPostAPI = {
  path: '/posts/:id',
  method: 'GET',
  param: [{ key: 'id', type: 'number' }],
};
const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await axios_1.default.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    res.status(200).json({
      post: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
exports.getPost = getPost;
