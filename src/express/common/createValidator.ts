import { Request, Response, NextFunction } from "express";
import * as ValidatorMethod from "express-validator";

import type { ValidatorKey, ValidatorItem } from "../../shared";

export const validator = (req: Request, _: Response, next: NextFunction) => {
  const errors = ValidatorMethod.validationResult(req);
  if (!errors.isEmpty()) {
    next({
      status: 400,
      message: errors
        .array()
        .map(
          (error: ValidatorMethod.ValidationError) =>
            `${error.param}: ${error.msg}`
        )
        .join(", "),
    });
  } else {
    next();
  }
};

export const validatorWrapper = (...props: any[]) => [...props, validator];

export const createValidation = (method: any, type: string) => {
  if (type === "string") {
    method = method.isString();
  } else if (type === "number") {
    method = method.isNumeric();
  } else if (type === "boolean") {
    method = method.isBoolean();
  } else if (type === "array") {
    method = method.isArray();
  } else if (type === "object") {
    method = method.isObject();
  }

  return method;
};

export const createValidator = (key: ValidatorKey, api: ValidatorItem) => {
  let method = ValidatorMethod[key](api.key);

  if (api.default) {
    method = method.default(api.default);
  }
  if (api.nullable) {
    method = method.optional({ nullable: true });
  }

  if (!Array.isArray(api.type)) {
    method = createValidation(method, api.type);
  } else {
    api.type.forEach((type) => {
      method = createValidation(method, type);
    });
  }

  return method;
};

export const createValidators = (
  controllers: Record<string, any>
): Record<string, any> => {
  const validators: Record<string, any> = {};
  Object.entries(controllers).forEach(([key, value]: [string, any]) => {
    if (key.indexOf("API") > -1) {
      const validatorName = key.replace("API", "");
      const validator: any[] = [];

      Object.entries(value).forEach((valueItem) => {
        const [controllerKey, apis] = valueItem as [
          ValidatorKey | string,
          ValidatorItem[]
        ];

        if (
          controllerKey === "param" ||
          controllerKey === "query" ||
          controllerKey === "header" ||
          controllerKey === "body"
        ) {
          apis.forEach((api: ValidatorItem) => {
            validator.push(createValidator(controllerKey, api));
          });
        }
      });

      validators[validatorName] = validatorWrapper(...validator);
    }
  });

  return validators;
};
