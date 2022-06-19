import type { Application } from 'express';
import type { ControllerAPI, ControllerAPIMethodLowerCase } from '../../shared';

export const createRouter = (
  app: Application,
  controllers: Record<string, any>,
  validators: any,
) => {
  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf('API') > -1) {
      const api = value as ControllerAPI;

      const name = key.replace('API', '');
      const controller = controllers[name];

      const path = api.path;
      const method = api.method.toLowerCase() as ControllerAPIMethodLowerCase;
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
