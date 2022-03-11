"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
class ParseEnv {
    constructor(config, props) {
        const env = config === null || config === void 0 ? void 0 : config.env;
        const options = config === null || config === void 0 ? void 0 : config.options;
        if (env && !options) {
            this.env = env;
        }
        else if (!env && options) {
            dotenv_1.default.config(options);
            this.env = process.env;
        }
        else {
            throw new Error("ENV, Options 모두 넣을 수 없습니다");
        }
        if (!props) {
            throw new Error("파싱할 데이터가 없습니다");
        }
        this.parseEnvList(props);
        if (config.flat) {
            this.flatEnvList();
        }
    }
    parseEnv(props) {
        if (!this.env)
            return null;
        if (typeof props === "string") {
            return this.parseAutoEnv({ key: props });
        }
        const { key, type } = props;
        if (!this.env[key]) {
            return null;
        }
        const value = this.env[key];
        switch (type) {
            case "string":
                return value;
            case "boolean":
                return value === "TRUE" || value === "true";
            case "number":
                return Number(value);
            case "json":
                return JSON.parse(value);
            case "auto":
                return this.parseAutoEnv(props);
            default:
                return value;
        }
    }
    parseAutoEnv(props) {
        let key;
        if (typeof props === "string") {
            key = props;
        }
        else {
            key = props.key;
        }
        if (!this.env[key]) {
            return null;
        }
        const value = this.env[key];
        const isNumberValue = Number(value);
        const isBooleanValue = value === "TRUE" ||
            value === "FALSE" ||
            value === "true" ||
            value === "false";
        const isJsonValue = ParseEnv.checkJsonString(value);
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
    }
    parseEnvList(props) {
        const result = {};
        props.forEach((item) => {
            const itemResult = this.parseEnv(item);
            if (typeof item === "string") {
                result[item] = itemResult;
            }
            else {
                result[item.key] = itemResult;
            }
        });
        this.result = result;
    }
    flatEnvList(splitKey) {
        if (!this.result || typeof this.result !== "object") {
            return;
        }
        if (!splitKey) {
            splitKey = "_";
        }
        const flattenResult = {};
        Object.entries(this.result).forEach(([key, value]) => {
            const splittedKeys = key.split(splitKey);
            const firstKey = splittedKeys[0];
            const otherKey = splittedKeys.slice(1).join(splitKey);
            const isOtherKey = otherKey !== "";
            if (isOtherKey) {
                if (!flattenResult[firstKey]) {
                    flattenResult[firstKey] = { [otherKey]: value };
                }
                else {
                    flattenResult[firstKey][otherKey] = value;
                }
            }
            else {
                flattenResult[key] = value;
            }
        });
        this.flattenResult = flattenResult;
    }
}
exports.ParseEnv = ParseEnv;
ParseEnv.checkJsonString = (value) => {
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
