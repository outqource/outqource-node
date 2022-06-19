'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createRouter = void 0;
const createRouter = (app, controllers, validators) => {
  Object.entries(controllers).forEach(([key, value]) => {
    if (key.indexOf('API') > -1) {
      const api = value;
      const name = key.replace('API', '');
      const controller = controllers[name];
      const path = api.path;
      const method = api.method.toLowerCase();
      const middlewares = [
        ...(api.middlewares || []),
        ...(validators[name] || []),
      ];
      if (method && path && controller) {
        app[method](path, ...middlewares, controller);
      }
    }
  });
};
exports.createRouter = createRouter;
