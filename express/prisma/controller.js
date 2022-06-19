'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createPrismaController = void 0;
const utils_1 = require('../../shared/utils');
const flat_1 = __importDefault(require('flat'));
const getTraverseOption = (req, jsonObj) => {
  const { params, query, body } = req;
  const request = {
    ...params,
    ...query,
    ...body,
  };
  const flatten = flat_1.default.flatten(jsonObj);
  Object.entries(flatten).forEach(([key, value]) => {
    Object.entries(request).forEach(([requestKey, requestValue]) => {
      if (
        typeof value === 'string' &&
        (value === null || value === void 0 ? void 0 : value.includes('$value'))
      ) {
        const splitted = value.split('/');
        const valueKey = splitted.length > 1 ? splitted[1] : null;
        const parseDataType = splitted.length > 2 ? splitted[2] : null;
        if (requestKey === valueKey) {
          flatten[key] = parseDataType
            ? (0, utils_1.parseValue)(requestValue, parseDataType)
            : (0, utils_1.parseAutoValue)(requestValue);
        }
      }
    });
  });
  Object.entries(flatten).forEach(([key, value]) => {
    const originKeys = key.split('.');
    const originKey = originKeys[originKeys.length - 1];
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      if (value === '$param' && paramKey === originKey) {
        flatten[key] = (0, utils_1.parseAutoValue)(paramValue);
      }
    });
    Object.entries(query).forEach(([queryKey, queryValue]) => {
      if (value === '$query' && queryKey === originKey) {
        flatten[key] =
          typeof queryValue === 'string'
            ? (0, utils_1.parseAutoValue)(queryValue)
            : queryValue;
      }
    });
    Object.entries(body).forEach(([bodyKey, bodyValue]) => {
      if (value === '$body' && bodyKey === originKey) {
        flatten[key] =
          typeof bodyValue === 'string'
            ? (0, utils_1.parseAutoValue)(bodyValue)
            : bodyValue;
      }
    });
  });
  Object.entries(flatten).forEach(([key, value]) => {
    if (
      value === '$param' ||
      value === '$query' ||
      value === '$body' ||
      (typeof value === 'string' && value.includes('$value'))
    ) {
      delete flatten[key];
    }
  });
  const result = flat_1.default.unflatten(flatten);
  return result;
};
const createPrismaGetController = (database, controllerAPI, options) => {
  const { table, actions, pagination: isPagination, softDelete } = options;
  let action;
  let isCount = false;
  // check GET
  if (Array.isArray(actions)) {
    actions.forEach(item => {
      if (
        item !== 'findMany' &&
        item !== 'findUnique' &&
        item !== 'findFirst' &&
        item !== 'count'
      ) {
        throw 'Error Occured! createPrismaController props.actions is not GET Controller!';
      }
      if (item !== 'count') {
        action = item;
      } else {
        isCount = true;
      }
    });
  } else {
    if (
      actions !== 'findMany' &&
      actions !== 'findUnique' &&
      actions !== 'findFirst' &&
      actions !== 'count'
    ) {
      throw 'Error Occured! createPrismaController props.actions is not GET Controller!';
    }
    if (actions === 'findMany') {
      isCount = true;
    }
    action = actions;
  }
  return async (req, res, next) => {
    var _a, _b, _c;
    const response = {};
    const db = database;
    const resultOptions = getTraverseOption(req, options.options || {});
    const pagination = {};
    const findOptions = {
      ...(options.options || {}),
      where:
        (resultOptions === null || resultOptions === void 0
          ? void 0
          : resultOptions.where) || {},
      select:
        (_a = options.options) === null || _a === void 0 ? void 0 : _a.select,
    };
    const countOptions = {
      where:
        (resultOptions === null || resultOptions === void 0
          ? void 0
          : resultOptions.where) || {},
    };
    // FindMany pagination
    if (
      action === 'findMany' &&
      (typeof isPagination === 'undefined' || isPagination)
    ) {
      const page =
        ((_b = req.query) === null || _b === void 0 ? void 0 : _b.page) || '1';
      const limit =
        ((_c = req.query) === null || _c === void 0 ? void 0 : _c.limit) ||
        '20';
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
      softDelete.forEach(item => {
        findOptions.where[item] = null;
      });
    }
    if (typeof softDelete === 'string') {
      findOptions.where[softDelete] = null;
    }
    try {
      let count = 0;
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
      if (action === 'findUnique' || action === 'findFirst') {
        if (!rows) {
          throw { status: 404, message: `NotFound ${table} data!` };
        }
        res.status(200).json({ row: rows });
      } else {
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  };
};
const createPrismaPostController = (database, _, options) => {
  const { table, actions, response } = options;
  const db = database;
  const action = actions;
  if (Array.isArray(action)) {
    throw 'Error Occured! createPrismaPostController props.actions is can not be array';
  }
  if (action !== 'create' && action !== 'createMany') {
    throw 'Error Occured! createPrismaController props.actions is not POST Controller!';
  }
  return async (req, res, next) => {
    try {
      const resultOptions = getTraverseOption(req, options.options || {});
      const row = await db[table][action](resultOptions);
      if (typeof response === 'boolean' && !response) {
        res.status(204).json();
      } else {
        res.status(201).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};
const createPrismaDeleteController = (database, _, options) => {
  const { table, actions, response } = options;
  const db = database;
  const action = actions;
  if (Array.isArray(action)) {
    throw `Error Occured! createPrismaDeleteController props.actions is can not be array in ${table} DELETE`;
  }
  if (action !== 'delete' && action !== 'deleteMany') {
    throw `Error Occured! createPrismaController props.actions is not ${table} DELETE Controller!`;
  }
  return async (req, res, next) => {
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
      if (typeof response === 'boolean' && !response) {
        res.status(204).json();
      } else {
        res.status(200).json({ id: row.id, isDeleted: true });
      }
    } catch (error) {
      next(error);
    }
  };
};
const createPrismaPutController = (database, _, options) => {
  const { table, actions, response } = options;
  const db = database;
  const action = actions;
  if (Array.isArray(action)) {
    throw 'Error Occured! createPrismaPutController props.actions is can not be array';
  }
  if (action !== 'update' && action !== 'updateMany') {
    throw 'Error Occured! createPrismaController props.actions is not PUT Controller!';
  }
  return async (req, res, next) => {
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
      if (typeof response === 'boolean' && !response) {
        res.status(204).json();
      } else {
        res.status(200).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};
const createPrismaPatchController = (database, _, options) => {
  const { table, actions, response } = options;
  const db = database;
  const action = actions;
  if (Array.isArray(action)) {
    throw 'Error Occured! createPrismaPatchController props.actions is can not be array';
  }
  if (action !== 'update' && action !== 'updateMany') {
    throw 'Error Occured! createPrismaController props.actions is not PATCH Controller!';
  }
  return async (req, res, next) => {
    const resultOptions = getTraverseOption(req, options.options || {});
    if (!resultOptions.where) {
      throw 'Error Occured! createPrismaController props.options.where not found in PATCH';
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
      if (typeof response === 'boolean' && !response) {
        res.status(204).json();
      } else {
        res.status(200).json(row);
      }
    } catch (error) {
      next(error);
    }
  };
};
const createPrismaController = (database, controllerAPI, options) => {
  const db = database;
  if (!db[options.table]) {
    throw 'Error Occured! createPrismaController props.table is not in database table!';
  }
  switch (controllerAPI.method) {
    case 'GET':
      return createPrismaGetController(database, controllerAPI, options);
    case 'POST':
      return createPrismaPostController(database, controllerAPI, options);
    case 'DELETE':
      return createPrismaDeleteController(database, controllerAPI, options);
    case 'PUT':
      return createPrismaPutController(database, controllerAPI, options);
    case 'PATCH':
      return createPrismaPatchController(database, controllerAPI, options);
    default:
      throw new Error('지원하지 않은 Method 입니다');
  }
};
exports.createPrismaController = createPrismaController;
