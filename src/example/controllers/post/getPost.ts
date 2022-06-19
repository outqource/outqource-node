import axios from 'axios';
import type { ControllerAPI, ExpressController } from '../../../express';

export const getPostAPI: ControllerAPI = {
  path: '/posts/:id',
  method: 'GET',
  param: [{ key: 'id', type: 'number' }],
};

export const getPost: ExpressController = async (req, res, next) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    res.status(200).json({
      post: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
