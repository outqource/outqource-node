import type { ControllerAPI, ExpressController } from '../../../express';

export const createPostAPI: ControllerAPI = {
  path: '/posts',
  method: 'POST',
  middlewares: [],
  body: [
    { key: 'title', type: 'string' },
    { key: 'content', type: 'string' },
  ],
};

export const createPost: ExpressController = async (req, res, next) => {
  try {
    res.status(200).json({
      body: { title: req.body.title, content: req.body.content },
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
