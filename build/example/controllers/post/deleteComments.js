'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.deleteComments = exports.deleteCommentsAPI = void 0;
exports.deleteCommentsAPI = {
  path: '/posts/:id/comments',
  method: 'DELETE',
  middlewares: [],
  body: [
    {
      key: 'commentIds',
      type: 'array',
      items: [
        { key: 'id', type: 'string' },
        { key: 'foo', type: 'string', nullable: true },
      ],
      example: ['uuid1', 'uuid2'],
    },
  ],
};
const deleteComments = async (req, res, next) => {
  try {
    res.status(200).json({
      body: { commentIds: req.body.commentIds },
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
exports.deleteComments = deleteComments;
