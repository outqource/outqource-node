'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const test = condition => {
  return (req, res, next) => {
    if (condition) {
      next();
    } else {
      next({ status: 400, message: '개발 서버에서만 작동하는 API 입니다' });
    }
  };
};
exports.default = test;
