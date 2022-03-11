"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitApp = void 0;
__exportStar(require("./createRouter"), exports);
__exportStar(require("./createValidator"), exports);
__exportStar(require("./createErrorController"), exports);
__exportStar(require("./createGlobalController"), exports);
var init_1 = require("./init");
Object.defineProperty(exports, "InitApp", { enumerable: true, get: function () { return __importDefault(init_1).default; } });
