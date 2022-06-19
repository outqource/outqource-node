import type { ControllerAPI, AjvValidator } from '../../shared';
import createAjvMiddleware from './createAjvMiddleware';

const createAjvValidator = (controllers: Record<string, any>) => {
  const validators: Record<string, any> = {};
  Object.entries(controllers).forEach(
    ([key, value]: [string, ControllerAPI | any]) => {
      if (key.indexOf('API') > -1) {
        const validatorName = key.replace('API', '');

        if (value.ajv) {
          const ajv = value.ajv as AjvValidator;
          const middleware = createAjvMiddleware(ajv);

          validators[validatorName] = [middleware];
        }
      }
    },
  );

  return validators;
};

export default createAjvValidator;
