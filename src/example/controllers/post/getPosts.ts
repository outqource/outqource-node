import axios from 'axios';
import { ControllerAPI, ExpressController } from '../../../express';

export const getPostsAPI: ControllerAPI = {
  path: '/posts',
  method: 'GET',
  query: [
    { key: 'page', type: 'number', default: 1 },
    { key: 'limit', type: 'number', default: 20 },
  ],
};

export const getPosts: ExpressController = async (req, res, next) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');

    res.status(200).json({
      posts: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
