"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValue = exports.parseAutoValue = void 0;
const checkJsonString = (value) => {
    try {
        const result = JSON.parse(value);
        if (result && typeof result === "object") {
            return true;
        }
        throw new Error("not json");
    }
    catch (error) {
        return false;
    }
};
const parseAutoValue = (value) => {
    const isNumberValue = Number(value);
    const isBooleanValue = value === "TRUE" ||
        value === "FALSE" ||
        value === "true" ||
        value === "false";
    const isJsonValue = checkJsonString(value);
    if (isNumberValue) {
        return isNumberValue;
    }
    else if (isBooleanValue) {
        return value === "TRUE" || value === "true";
    }
    else if (isJsonValue) {
        return JSON.parse(value);
    }
    else {
        return value;
    }
};
exports.parseAutoValue = parseAutoValue;
const parseValue = (value, type = "auto") => {
    switch (type) {
        case "string":
            return value;
        case "boolean":
            console.log(`parseValue`, value, type);
            return value === "TRUE" || value === "true";
        case "number":
            return Number(value);
        case "json":
            return JSON.parse(value);
        case "auto":
            return (0, exports.parseAutoValue)(value);
        default:
            return (0, exports.parseAutoValue)(value);
    }
};
exports.parseValue = parseValue;
