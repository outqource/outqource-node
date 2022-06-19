'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Sharp = void 0;
const sharp_1 = __importDefault(require('sharp'));
class Sharp {
  constructor(props) {
    this.maxWidth =
      props === null || props === void 0 ? void 0 : props.maxWidth;
    this.maxHeight =
      props === null || props === void 0 ? void 0 : props.maxHeight;
  }
  async resizeImage(buffer) {
    const metadata = await (0, sharp_1.default)(buffer).metadata();
    const { width, height } = metadata;
    const options = {
      fit: 'contain',
    };
    if (width && height && this.maxWidth && this.maxHeight) {
      if (width > height && width > this.maxWidth) {
        options.width = this.maxWidth;
      } else if (width > height && width <= this.maxWidth) {
        options.width = width;
      }
      if (width < height && height > this.maxHeight) {
        options.height = this.maxHeight;
      } else if (width < height && height <= this.maxHeight) {
        options.height = height;
      }
    }
    const newBuffer = await (0, sharp_1.default)(buffer)
      .resize(options)
      .withMetadata()
      .toBuffer();
    return newBuffer;
  }
}
exports.Sharp = Sharp;
