'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.responseWithId =
  exports.emptyResponse =
  exports.tokenDTO =
  exports.timeDTO =
  exports.createListResponse =
  exports.createDetailResponse =
  exports.createPaginationRequestDTO =
  exports.paginationDTO =
  exports.paginationRequestDTO =
  exports.getPagination =
    void 0;
const range_1 = __importDefault(require('lodash/range'));
const getPagination = (take, skip, count) => {
  const limit = Number(take);
  const page = (Number(skip) % Number(take)) + 1;
  const offset = Number(skip);
  const isPrev = Number(page) <= 0;
  const isNext = page * limit < count;
  return {
    count,
    isNext,
    isPrev,
    limit,
    offset,
    page,
  };
};
exports.getPagination = getPagination;
const paginationRequestDTO = () => {
  return [
    { key: 'page', type: 'number', default: 1, nullable: true },
    { key: 'limit', type: 'number', default: 20, nullable: true },
  ];
};
exports.paginationRequestDTO = paginationRequestDTO;
exports.paginationDTO = {
  count: 'number',
  page: 'number',
  limit: 'number',
  offset: 'number',
  isPrev: 'boolean',
  isNext: 'boolean',
};
const createPaginationRequestDTO = (data, status) => ({
  status: status || 200,
  example: { pagination: exports.paginationDTO, rows: (0, range_1.default)(0, 3).map(() => data) },
});
exports.createPaginationRequestDTO = createPaginationRequestDTO;
const createDetailResponse = (row, status) => ({
  status: status || 200,
  example: { row },
});
exports.createDetailResponse = createDetailResponse;
const createListResponse = (rows, status) => ({
  status: status || 200,
  example: { pagination: exports.paginationDTO, rows: (0, range_1.default)(0, 3).map(() => rows) },
});
exports.createListResponse = createListResponse;
exports.timeDTO = {
  createdAt: 'date',
  updatedAt: 'date',
  deletedAt: 'date | null',
};
const tokenDTO = status => {
  return {
    status,
    example: {
      accessToken: 'string',
      refreshToken: 'string',
    },
  };
};
exports.tokenDTO = tokenDTO;
const emptyResponse = status => {
  return {
    status,
    example: {},
  };
};
exports.emptyResponse = emptyResponse;
const responseWithId = status => {
  return {
    status,
    example: { id: 'string' },
  };
};
exports.responseWithId = responseWithId;
