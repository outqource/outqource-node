'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.imageAndVideoUploader =
  exports.videoUploader =
  exports.imageUploader =
  exports.allUploader =
  exports.createUploader =
  exports.pagination =
  exports.test =
  exports.swagger =
  exports.jsonwebtoken =
  exports.cors =
  exports.urlencoded =
  exports.json =
    void 0;
const express_1 = require('express');
Object.defineProperty(exports, 'json', {
  enumerable: true,
  get: function () {
    return express_1.json;
  },
});
Object.defineProperty(exports, 'urlencoded', {
  enumerable: true,
  get: function () {
    return express_1.urlencoded;
  },
});
const jsonwebtoken_1 = __importDefault(require('./jsonwebtoken'));
exports.jsonwebtoken = jsonwebtoken_1.default;
const swagger_1 = __importDefault(require('./swagger'));
exports.swagger = swagger_1.default;
const test_1 = __importDefault(require('./test'));
exports.test = test_1.default;
const cors_1 = __importDefault(require('cors'));
exports.cors = cors_1.default;
const pagination_1 = __importDefault(require('./pagination'));
exports.pagination = pagination_1.default;
const multer_1 = __importStar(require('./multer'));
exports.createUploader = multer_1.default;
Object.defineProperty(exports, 'allUploader', {
  enumerable: true,
  get: function () {
    return multer_1.allUploader;
  },
});
Object.defineProperty(exports, 'imageUploader', {
  enumerable: true,
  get: function () {
    return multer_1.imageUploader;
  },
});
Object.defineProperty(exports, 'videoUploader', {
  enumerable: true,
  get: function () {
    return multer_1.videoUploader;
  },
});
Object.defineProperty(exports, 'imageAndVideoUploader', {
  enumerable: true,
  get: function () {
    return multer_1.imageAndVideoUploader;
  },
});
