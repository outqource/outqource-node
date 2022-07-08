'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getEnumValues = void 0;
const getEnumValues = target => {
  const value = Object.values(target).reduce(
    (prev, curr) => {
      prev[0] += curr + ',';
      return prev;
    },
    [''],
  );
  return [value[0].slice(0, value[0].length - 1)];
};
exports.getEnumValues = getEnumValues;
