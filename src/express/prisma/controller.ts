/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { ControllerAPI } from "../../shared/openapi";
import _ from "lodash";
import Flat from "flat";

export type PrismaAction =
  | "findUnique"
  | "findMany"
  | "findFirst"
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "upsert"
  | "delete"
  | "deleteMany"
  | "executeRaw"
  | "queryRaw"
  | "aggregate"
  | "count";

export type TcreatePrismaControllerOptions = {
  table: string;
  actions: PrismaAction[] | PrismaAction;
  pagination?: boolean;
  response?: boolean;
  softDelete?: string | string[];
  options?: any;
};

const getTraverseOption = (req: Request, jsonObj: any) => {
  const { params, query, body } = req;

  const flatten = Flat.flatten(jsonObj);

  Object.entries(flatten as object).forEach(([key, value]) => {
    const originKeys = key.split(".");
    const originKey = originKeys[originKeys.length - 1];

    Object.entries(params).forEach(([paramKey, paramValue]) => {
      if (value === "$param" && paramKey === originKey) {
        (flatten as any)[key] = paramValue;
      }
    });

    Object.entries(query).forEach(([queryKey, queryValue]) => {
      if (value === "$query" && queryKey === originKey) {
        (flatten as any)[key] = queryValue;
      }
    });

    Object.entries(body).forEach(([bodyKey, bodyValue]) => {
      if (value === "$body" && bodyKey === originKey) {
        (flatten as any)[key] = bodyValue;
      }
    });
  });

  Object.entries(flatten as object).forEach(([key, value]) => {
    if (value === "$param" || value === "$query" || value === "$body") {
      delete (flatten as any)[key];
    }
  });

  return Flat.unflatten(flatten) as any;
};

const createPrismaGetController = (
  database: PrismaClient,
  _: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const { table, actions, pagination, softDelete } = options;
  let action: PrismaAction;
  let isCount = false;

  // check GET
  if (Array.isArray(actions)) {
    actions.forEach((item) => {
      if (
        item !== "findMany" &&
        item !== "findUnique" &&
        item !== "findFirst" &&
        item !== "count"
      ) {
        throw "Error Occured! createPrismaController props.actions is not GET Controller!";
      }
      if (item !== "count") {
        action = item;
      } else {
        isCount = true;
      }
    });
  } else {
    if (
      actions !== "findMany" &&
      actions !== "findUnique" &&
      actions !== "findFirst" &&
      actions !== "count"
    ) {
      throw "Error Occured! createPrismaController props.actions is not GET Controller!";
    }

    action = actions;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const response: any = {};
    const db = database as any;

    const resultOptions = getTraverseOption(req, options.options || {});
    const pagination: any = {};
    const findOptions: any = {
      ...(options.options || {}),
      where: resultOptions?.where || {},
      select: options.options?.select,
    };
    const countOptions: any = {
      where: resultOptions?.where || {},
    };

    // FindMany pagination
    if (
      action === "findMany" &&
      (typeof pagination === "undefined" || pagination)
    ) {
      const page = (req.query?.page || "1") as string;
      const limit = (req.query?.limit || "20") as string;

      const take = Number(limit) || 20;
      const skip = (Number(page) - 1) * take;
      findOptions.take = take;
      findOptions.skip = skip;

      pagination.page = Number(page);
      pagination.limit = Number(limit);
      pagination.offset = skip;
      pagination.isPrev = Number(page) <= 0;
    }

    // Soft Delete Check
    if (Array.isArray(softDelete)) {
      softDelete.forEach((item) => {
        findOptions.where[item] = null;
      });
    }
    if (typeof softDelete === "string") {
      findOptions.where[softDelete] = null;
    }

    try {
      let count: undefined | number = 0;
      if (isCount) {
        count = await db[table].count(countOptions);
        response.count = count;

        // pagination
        pagination.count = count;
        pagination.isNext = pagination.page * pagination.limit < response.count;
        response.pagination = pagination;
      }

      const rows = await db[table][action](findOptions);
      response.rows = rows;

      if (action === "findUnique" || (action === "findFirst" && !rows)) {
        throw { status: 404, message: `NotFound ${table} data!` };
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
};

const createPrismaPostController = (
  database: PrismaClient,
  _: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const { table, actions, response } = options;
  const db = database as any;
  const action = actions;

  if (Array.isArray(action)) {
    throw "Error Occured! createPrismaPostController props.actions is can not be array";
  }
  if (action !== "create" && action !== "createMany") {
    throw "Error Occured! createPrismaController props.actions is not POST Controller!";
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultOptions = getTraverseOption(req, options.options || {});
      const row = await db[table][action](resultOptions);

      if (typeof response === "boolean" && !response) {
        res.status(204).json();
      } else {
        res.status(201).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};

const createPrismaDeleteController = (
  database: PrismaClient,
  _: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const { table, actions, response } = options;
  const db = database as any;
  const action = actions;

  if (Array.isArray(action)) {
    throw `Error Occured! createPrismaDeleteController props.actions is can not be array in ${table} DELETE`;
  }
  if (action !== "delete" && action !== "deleteMany") {
    throw `Error Occured! createPrismaController props.actions is not ${table} DELETE Controller!`;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const resultOptions = getTraverseOption(req, options.options || {});
    if (!resultOptions.where) {
      throw `Error Occured! createPrismaController props.options.where not found in ${table} DELETE`;
    }

    try {
      const findRow = await db[table].findFirst({ where: resultOptions.where });
      if (!findRow) {
        throw { status: 404, message: `NotFound ${table} data!` };
      }

      const row = await db[table][action](resultOptions);

      if (typeof response === "boolean" && !response) {
        res.status(204).json();
      } else {
        res.status(200).json({ id: row.id, isDeleted: true });
      }
    } catch (error) {
      next(error);
    }
  };
};

const createPrismaPutController = (
  database: PrismaClient,
  _: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const { table, actions, response } = options;
  const db = database as any;
  const action = actions;

  if (Array.isArray(action)) {
    throw "Error Occured! createPrismaPutController props.actions is can not be array";
  }
  if (action !== "update" && action !== "updateMany") {
    throw "Error Occured! createPrismaController props.actions is not PUT Controller!";
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const resultOptions = getTraverseOption(req, options.options || {});
    if (!resultOptions.where) {
      throw `Error Occured! createPrismaController props.options.where not found in ${table} PUT`;
    }

    try {
      const findRow = await db[table].findFirst({ where: resultOptions.where });
      if (!findRow) {
        throw { status: 404, message: `NotFound ${table} data!` };
      }

      const row = await db[table][action](resultOptions);

      if (typeof response === "boolean" && !response) {
        res.status(204).json();
      } else {
        res.status(200).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};

const createPrismaPatchController = (
  database: PrismaClient,
  _: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const { table, actions, response } = options;
  const db = database as any;
  const action = actions;

  if (Array.isArray(action)) {
    throw "Error Occured! createPrismaPatchController props.actions is can not be array";
  }
  if (action !== "update" && action !== "updateMany") {
    throw "Error Occured! createPrismaController props.actions is not PATCH Controller!";
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const resultOptions = getTraverseOption(req, options.options || {});
    if (!resultOptions.where) {
      throw "Error Occured! createPrismaController props.options.where not found in PATCH";
    }

    try {
      const findRow = await db[table].findFirst({ where: resultOptions.where });
      if (!findRow) {
        throw { status: 404, message: `NotFound ${table} data!` };
      }

      const row = await db[table][action]({
        ...resultOptions,
        where: {
          ...(resultOptions.data || {}),
          ...findRow,
        },
      });

      if (typeof response === "boolean" && !response) {
        res.status(204).json();
      } else {
        res.status(200).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};

export const createPrismaController = (
  database: PrismaClient,
  controllerAPI: ControllerAPI,
  options: TcreatePrismaControllerOptions
) => {
  const db = database as any;
  if (!db[options.table]) {
    throw "Error Occured! createPrismaController props.table is not in database table!";
  }

  switch (controllerAPI.method) {
    case "GET":
      return createPrismaGetController(database, controllerAPI, options);
    case "POST":
      return createPrismaPostController(database, controllerAPI, options);
    case "DELETE":
      return createPrismaDeleteController(database, controllerAPI, options);
    case "PUT":
      return createPrismaPutController(database, controllerAPI, options);
    case "PATCH":
      return createPrismaPatchController(database, controllerAPI, options);
  }
};
