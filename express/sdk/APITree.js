"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Parameter_getType;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameter = exports.APITreeItem = void 0;
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class APITree {
    constructor(parent) {
        this.children = [];
        this.items = [];
        this.parent = parent;
    }
    static create(parent, filePath) {
        var e_1, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const tree = new APITree(parent);
            const files = yield fs.readdir(filePath);
            try {
                for (var files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), !files_1_1.done;) {
                    const file = files_1_1.value;
                    const indexPath = path_1.default.join(filePath, file);
                    const stat = yield fs.stat(indexPath);
                    if (stat.isDirectory()) {
                        tree.children.push(yield APITree.create(`${parent}/${file}`, indexPath));
                    }
                    else {
                        const content = require(indexPath);
                        const apiKey = Object.keys(content).find(key => key.endsWith('API'));
                        if (!apiKey) {
                            throw new Error(`Controller API not specified at: ${indexPath}`);
                        }
                        const api = content[apiKey];
                        tree.items.push(new APITreeItem(api, apiKey));
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_b = files_1.return)) yield _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return tree;
        });
    }
}
exports.default = APITree;
class APITreeItem {
    // TODO: Response Type
    // readonly response: Response[];
    constructor(api, name) {
        this.param = [];
        this.query = [];
        this.body = [];
        this.name = name.replace(/API$/, '');
        this.path = api.path;
        this.method = api.method;
        this.summary = api.summary;
        if (api.param)
            this.param = api.param.map(item => new Parameter(item));
        if (api.query)
            this.query = api.query.map(item => new Parameter(item));
        if (api.body)
            this.body = api.body.map(item => new Parameter(item));
    }
    getTypescriptInterface() {
        return `
export interface ${this.interfaceName} {
    ${this.param.length > 0 && `
    params${this.param.every((item) => item.required) ? '' : '?'}: {
        ${this.param.map((item) => item.getTypescriptInterface()).join("\n")}
    }`}
    ${this.query.length > 0 && `
    query${this.query.every((item) => item.required) ? '' : '?'}: {
        ${this.query.map((item) => item.getTypescriptInterface()).join("\n")}
    }`}
    ${this.body.length > 0 && `
    body${this.body.every((item) => item.required) ? '' : '?'}: {
        ${this.body.map((item) => item.getTypescriptInterface()).join("\n")}
    }
    `}
}
`;
    }
    getExecutor() {
        return `
import axios from 'axios';

export const ${this.name} = async (request: ${this.interfaceName}) => {
    const { params, query, body } = request;
    let url = '${this.path}';

    ${this.param.length > 0 && `
    if (params && Object.keys(params).length > 0) {
        url = url.replace(/:(\\w+)/g, (match, key) => {
            const value = params[key];
            if (value) {
                return value;
            }
            return match;
        });
    }
    `}

    ${this.query.length > 0 && `
    if (query && Object.keys(query).length > 0) {
        url += '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    }
    `}
    
    // TODO
}`;
    }
    get interfaceName() {
        return this.name[0].toUpperCase() + this.name.slice(1);
    }
}
exports.APITreeItem = APITreeItem;
class Parameter {
    constructor(item) {
        this.name = item.key;
        this.type = __classPrivateFieldGet(Parameter, _a, "m", _Parameter_getType).call(Parameter, item.type);
        this.required = !item.nullable && !item.default;
    }
    getTypescriptInterface() {
        return `${this.name}${this.required ? '?' : ''}: ${this.type}`;
    }
}
exports.Parameter = Parameter;
_a = Parameter, _Parameter_getType = function _Parameter_getType(type) {
    switch (type) {
        case "array":
            return "unknown[]";
        case "file":
        case "none":
            return "unknown";
        case "object":
            return "Record<string, unknown>";
        default:
            return type;
    }
};
