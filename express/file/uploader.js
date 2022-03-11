"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageAndVideoUploader = exports.videoUploader = exports.imageUploader = exports.allUploader = exports.createUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const dataType_1 = require("./dataType");
const createUploader = (allowFileTypes) => {
    return (0, multer_1.default)({
        fileFilter: (_, file, callback) => {
            if (allowFileTypes === "ALL") {
                callback(null, true);
            }
            else {
                const fileType = (0, dataType_1.getFileType)(file);
                if (Array.isArray(allowFileTypes)) {
                    let isAllowed = false;
                    allowFileTypes.forEach((allowFileType) => {
                        if (allowFileType === fileType) {
                            isAllowed = true;
                        }
                    });
                    if (!isAllowed) {
                        return callback(new Error(`Only ${allowFileTypes.join(",")} are allowed`));
                    }
                    else {
                        callback(null, true);
                    }
                }
                else {
                    if (allowFileTypes === fileType) {
                        callback(null, true);
                    }
                    else {
                        return callback(new Error(`Only ${allowFileTypes} are allowed`));
                    }
                }
            }
        },
    });
};
exports.createUploader = createUploader;
exports.allUploader = (0, exports.createUploader)("ALL");
exports.imageUploader = (0, exports.createUploader)("IMAGE");
exports.videoUploader = (0, exports.createUploader)("VIDEO");
exports.imageAndVideoUploader = (0, exports.createUploader)(["IMAGE", "VIDEO"]);
