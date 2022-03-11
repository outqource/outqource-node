"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = () => {
    return (req, res, next) => {
        var _a, _b;
        const page = (((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) || "1");
        const limit = (((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) || "20");
        const take = Number(limit) || 20;
        const skip = (Number(page) - 1) * take;
        req.take = take;
        req.skip = skip;
        next();
    };
};
exports.default = pagination;
