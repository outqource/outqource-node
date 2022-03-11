"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorController = void 0;
const createErrorController = (props) => {
    return (err, req, res, next) => {
        let header = props === null || props === void 0 ? void 0 : props.header;
        const isConsole = props === null || props === void 0 ? void 0 : props.isConsole;
        const error = Object.assign({ status: err.status || 500, message: err.message || "Server Internal Error" }, err);
        if (!header) {
            header = `Error! Occurred`;
        }
        if (typeof isConsole === "undefined" || isConsole) {
            console.warn(header, err);
        }
        res.status(error.status).json(error);
    };
};
exports.createErrorController = createErrorController;
