'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = void 0;
var Generator_1 = require('./Generator');
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return __importDefault(Generator_1).default;
  },
});
// import Generator from './Generator';
// if (require.main === module) {
//   const root = process.argv[2];
//   const dest = process.argv[3];
//   if (!root || !dest) {
//     console.error('Usage: npx outqource-node <root> <dest>');
//     process.exit(1);
//   }
//
//   // generate(root, dest).then(() => {
//   //   console.log('Done');
//   // });
// }
