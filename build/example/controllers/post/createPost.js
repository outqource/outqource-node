'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createPost = exports.createPostAPI = void 0;
exports.createPostAPI = {
  path: '/posts',
  method: 'POST',
  middlewares: [],
  body: [
    { key: 'title', type: 'string' },
    { key: 'content', type: 'string' },
    { key: 'phoneNumber', type: 'string' },
  ],
};
const createPost = async (req, res, next) => {
  try {
    res.status(200).json({
      body: req.body,
      ...req.query,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
exports.createPost = createPost;
