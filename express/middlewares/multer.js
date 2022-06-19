'use strict';
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
    void 0;
const path_1 = __importDefault(require('path'));
const multer_1 = __importDefault(require('multer'));
const isArray_1 = __importDefault(require('lodash/isArray'));
const getFileType = file => {
  const ext = path_1.default.extname(file.originalname);
  const mimetype = file.mimetype;
  if (
    mimetype.includes('image/') ||
    ext === '.jpg' ||
    ext === '.png' ||
    ext === '.gif' ||
    ext === '.jpeg'
  ) {
    return 'IMAGE';
  } else if (
    ext === '.mp4' ||
    ext === '.avi' ||
    ext === '.wmv' ||
    ext === '.mov' ||
    mimetype.includes('video/')
  ) {
    return 'VIDEO';
  }
  return 'NONE';
};
const checkFileType = (file, allowFileTypes) => {
  const fileType = getFileType(file);
  if ((0, isArray_1.default)(allowFileTypes)) {
    let isAllowed = false;
    allowFileTypes.forEach(allowFileType => {
      if (allowFileType === 'ALL') isAllowed = true;
      if (allowFileType === fileType) isAllowed = true;
    });
    return isAllowed;
  } else {
    if (allowFileTypes === 'ALL') return true;
    if (allowFileTypes === fileType) return true;
    return false;
  }
};
const createUploader = (allowFileTypes, limits) => {
  return (0, multer_1.default)({
    fileFilter: (_, file, callback) => {
      const isAllowed = checkFileType(file, allowFileTypes);
      if (!isAllowed) {
        return callback(new Error('Not Allowed FileType'));
      } else {
        return callback(null, true);
      }
    },
    limits: {
      fileSize: 50000000,
      ...(limits || {}),
    },
  });
};
exports.allUploader = createUploader('ALL');
exports.imageUploader = createUploader('IMAGE');
exports.videoUploader = createUploader('VIDEO');
exports.imageAndVideoUploader = createUploader(['IMAGE', 'VIDEO']);
exports.default = createUploader;
