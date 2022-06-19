import type { ControllerAPI, AjvValidator, ValidatorItem } from '../../shared';
import createAjvMiddleware, { CreateAJVMiddlewareProps } from './createAjvMiddleware';
import { JSONSchemaType } from 'ajv';

const createAjvValidator = (controllers: Record<string, any>) => {
  const validators: Record<string, any> = {};
  Object.entries(controllers).forEach(([key, value]: [string, ControllerAPI | any]) => {
    if (key.includes('API')) {
      const validatorName = key.replace('API', '');

      if (value.ajv) {
        const ajv: CreateAJVMiddlewareProps<any, any, any> = {};
        Object.entries(value.ajv as AjvValidator).forEach(([key, value]: [string, ValidatorItem[]]) => {
          const validator: JSONSchemaType<Record<string, any>> = {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false,
          };

          value.forEach((item: ValidatorItem) => {
            if (item.type === 'string' || item.type === 'number' || item.type === 'boolean') {
              (validator as JSONSchemaType<Record<string, any>>).properties[item.key] = { type: item.type };
            }

            if (!item.nullable) {
              (validator as JSONSchemaType<Record<string, any>>).required.push(item.key);
            }
          });

          ajv[key as 'params' | 'query' | 'body'] = validator;
        });

        const middleware = createAjvMiddleware(ajv);
        validators[validatorName] = [middleware];
      }
    }
  });

  return validators;
};

export default createAjvValidator;
