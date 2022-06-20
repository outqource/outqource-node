declare const controllers: {
  getTodosAPI: import('../..').ControllerAPI<any, any, any>;
  getTodos: import('../..').ExpressController;
  getPostsAPI: import('../..').ControllerAPI<any, any, any>;
  getPosts: import('../..').ExpressController;
  getPostAPI: import('../..').ControllerAPI<any, any, any>;
  getPost: import('../..').ExpressController;
  createPostAPI: import('../..').ControllerAPI<any, any, any>;
  createPost: import('../..').ExpressController;
  deleteCommentsAPI: import('../..').ControllerAPI<any, any, any>;
  deleteComments: import('../..').ExpressController;
};
export default controllers;
