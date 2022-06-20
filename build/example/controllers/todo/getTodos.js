'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTodos = exports.getTodosAPI = void 0;
const axios_1 = __importDefault(require('axios'));
exports.getTodosAPI = {
  path: '/todos',
  method: 'GET',
};
const getTodos = async (req, res, next) => {
  try {
    const response = await axios_1.default.get('https://jsonplaceholder.typicode.com/todos');
    res.status(200).json({
      todos: response.data,
    });
  } catch (error) {
    next({ status: 500, message: 'Server Internal Error' });
  }
};
exports.getTodos = getTodos;
