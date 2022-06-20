/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

interface IprismaControllerGenerator {
  jsonPath: string;
  writePath: string;
}

export const prismaControllerGenerator = async ({ jsonPath, writePath }: IprismaControllerGenerator) => {
  const file = await fs.readFileSync(jsonPath);
  const crudJson = JSON.parse(file.toString());

  const filename = crudJson.filename || 'crud';
  const prefix = crudJson.prefix || '';

  Object.entries(crudJson).forEach(([controllerName, controllerInfo]: any) => {
    if (typeof controllerInfo === 'object') {
      const tags = controllerInfo.tags;
      const controllers = controllerInfo.controllers;

      let result = `
import type { ControllerAPI } from 'outqource-express';
import { createPrismaController } from 'common';
import database from 'database';

`;

      controllers.forEach(async (controller: any) => {
        const {
          name,
          summary,
          method,
          path,
          query,
          param,
          body,
          responses,
          formData,
          table,
          actions,
          softDelete,
          options,
        } = controller;

        // ControllerAPI
        const controllerAPIData: any = {
          tags,
          summary,
          path: prefix + path,
          method,
        };
        if (query) controllerAPIData.query = query;
        if (param) controllerAPIData.param = param;
        if (formData) controllerAPIData.formData = formData;
        if (body) controllerAPIData.body = body;
        if (responses) controllerAPIData.responses = responses;

        const controllerAPI = `export const ${name}API: ControllerAPI = ${JSON.stringify(controllerAPIData)};`;
        result = result + controllerAPI + '\n\n';

        // CRUD Controller
        const crudData = {
          table,
          actions,
          softDelete,
          options,
        };
        const crud = `export const ${name} = createPrismaController(database, ${name}API, ${JSON.stringify(
          crudData,
        )});`;
        result = result + crud + '\n\n';
      });

      const writFilePath = `${writePath}/${controllerName}/${filename}.ts`;

      fs.writeFile(writFilePath, result, err => {
        if (err) throw err;
      });
    }
  });
};
