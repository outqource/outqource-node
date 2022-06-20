'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const Generator_1 = __importDefault(require('./Generator'));
if (require.main === module) {
  const root = process.argv[2];
  const dest = process.argv[3];
  if (!root || !dest) {
    console.error('Usage: npx outqource-node <root> <dest>');
    process.exit(1);
  }
  generate(root, dest).then(() => {
    console.log('Done');
  });
}
async function generate(root, dest) {
  return await Generator_1.default.generate(root, dest);
}
exports.default = generate;
