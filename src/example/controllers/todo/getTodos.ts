import axios from 'axios';
import type { ControllerAPI, ExpressController } from '../../../express';

export const getTodosAPI: ControllerAPI = {
  path: '/todos',
  method: 'GET',
};

export const getTodos: ExpressController = async (req, res, next) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    res.status(200).json({
      todos: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
