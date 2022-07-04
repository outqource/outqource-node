import { PrismaClient } from '@prisma/client';
import { ControllerAPI, createPrismaController, ExpressController } from '../../../express';

export const deleteCommentsAPI: ControllerAPI = {
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

export const deleteComments: ExpressController = async (req, res, next) => {
  try {
    res.status(200).json({
      body: { commentIds: req.body.commentIds },
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
