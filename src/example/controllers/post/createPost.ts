import type { ControllerAPI, ExpressController } from '../../../express';

export const createPostAPI: ControllerAPI = {
  path: '/posts',
  method: 'POST',
  middlewares: [],
  body: [
    { key: 'title', type: 'string' },
    { key: 'content', type: 'string' },
    { key: 'phoneNumber', type: 'string' },
  ],
};

export const createPost: ExpressController = async (req, res, next) => {
  try {
    res.status(200).json({
      body: req.body,
      ...req.query,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
