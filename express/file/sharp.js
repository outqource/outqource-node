"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sharp = void 0;
const sharp_1 = __importDefault(require("sharp"));
class Sharp {
    constructor(props) {
        this.maxWidth = props === null || props === void 0 ? void 0 : props.maxWidth;
        this.maxHeight = props === null || props === void 0 ? void 0 : props.maxHeight;
    }
    resizeImage(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield (0, sharp_1.default)(buffer).metadata();
            const { width, height } = metadata;
            const options = {
                fit: "contain",
            };
            if (width && height && this.maxWidth && this.maxHeight) {
                if (width > height && width > this.maxWidth) {
                    options.width = this.maxWidth;
                }
                else if (width > height && width <= this.maxWidth) {
                    options.width = width;
                }
                if (width < height && height > this.maxHeight) {
                    options.height = this.maxHeight;
                }
                else if (width < height && height <= this.maxHeight) {
                    options.height = height;
                }
            }
            const newBuffer = yield (0, sharp_1.default)(buffer)
                .resize(options)
                .withMetadata()
                .toBuffer();
            return newBuffer;
        });
    }
}
exports.Sharp = Sharp;
