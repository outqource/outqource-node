'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createRandomNumbers = exports.randomNumber = void 0;
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
exports.randomNumber = randomNumber;
const createRandomNumbers = length => {
  const chars = '0123456789';
  let randomstring = '';
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};
exports.createRandomNumbers = createRandomNumbers;
