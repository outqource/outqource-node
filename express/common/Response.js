'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createResponse = void 0;
const createResponse = props => {
  const { skip, take, count, data } = props;
  if (count && Array.isArray(data)) {
    if (typeof skip !== 'number' || typeof take !== 'number') {
      return { count, rows: data };
    }
    const page = skip / take + 1;
    const isPrev = page !== 1;
    const isNext = skip + take < count;
    return {
      pagination: {
        skip,
        take,
        count,
        page,
        limit: take,
        isPrev,
        isNext,
      },
      count,
      rows: data,
    };
  } else {
    return { row: data };
  }
};
exports.createResponse = createResponse;
