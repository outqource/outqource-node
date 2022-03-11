"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = void 0;
const getFileType = (file) => {
    if (!(file === null || file === void 0 ? void 0 : file.mimetype)) {
        return "NONE";
    }
    if (file.mimetype.indexOf("image") > -1) {
        return "IMAGE";
    }
    else if (file.mimetype.indexOf("video") > -1) {
        return "VIDEO";
    }
    else {
        return "NONE";
    }
};
exports.getFileType = getFileType;
