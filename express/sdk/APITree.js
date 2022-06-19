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
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it',
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a, _APITree_isExistPath, _b, _Parameter_getType;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Parameter = exports.APITreeItem = void 0;
const fs = __importStar(require('fs/promises'));
const fs_1 = require('fs');
const path_1 = __importDefault(require('path'));
class APITree {
  constructor(parent) {
    this.children = [];
    this.items = [];
    this.parent = parent;
  }
  static async create(parent, filePath) {
    const tree = new APITree(parent);
    const files = await fs.readdir(filePath);
    for await (const file of files) {
      const indexPath = path_1.default.join(filePath, file);
      const stat = await fs.stat(indexPath);
      if (stat.isDirectory()) {
        tree.children.push(
          await APITree.create(`${parent}/${file}`, indexPath),
        );
      } else {
        const content = require(indexPath);
        const apiKey = Object.keys(content).find(key => key.endsWith('API'));
        if (!apiKey) {
          throw new Error(`Controller API not specified at: ${indexPath}`);
        }
        const api = content[apiKey];
        tree.items.push(new APITreeItem(api, apiKey));
      }
    }
    return tree;
  }
  async writeFiles(dest) {
    if (
      !(await __classPrivateFieldGet(
        APITree,
        _a,
        'm',
        _APITree_isExistPath,
      ).call(APITree, dest))
    ) {
      await fs.mkdir(dest);
    }
    await Promise.all([
      ...this.items.map(item =>
        item.writeFile(path_1.default.join(dest, this.parent)),
      ),
      ...this.children.map(child =>
        child.writeFiles(path_1.default.join(dest, this.parent)),
      ),
    ]);
  }
}
exports.default = APITree;
(_a = APITree),
  (_APITree_isExistPath = async function _APITree_isExistPath(dest) {
    try {
      await fs.access(dest, fs_1.constants.F_OK);
      return true;
    } catch (_c) {
      return false;
    }
  });
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
    if (api.param) this.param = api.param.map(item => new Parameter(item));
    if (api.query) this.query = api.query.map(item => new Parameter(item));
    if (api.body) this.body = api.body.map(item => new Parameter(item));
  }
  getImportSource() {
    return `
import axios from 'axios';
`;
  }
  getTypescriptInterface() {
    return `
export interface ${this.interfaceName} {
    ${
      this.param.length > 0 &&
      `
    params${this.param.every(item => item.required) ? '' : '?'}: {
        ${this.param.map(item => item.getTypescriptInterface()).join('\n')}
    }`
    }
    ${
      this.query.length > 0 &&
      `
    query${this.query.every(item => item.required) ? '' : '?'}: {
        ${this.query.map(item => item.getTypescriptInterface()).join('\n')}
    }`
    }
    ${
      this.body.length > 0 &&
      `
    body${this.body.every(item => item.required) ? '' : '?'}: {
        ${this.body.map(item => item.getTypescriptInterface()).join('\n')}
    }
    `
    }
}

`;
  }
  getExecutor() {
    return `
export const ${this.name} = async (request: ${this.interfaceName}) => {
    const { params, query, body } = request;
    let url = '${this.path}';

    ${
      this.param.length > 0 &&
      `
    if (params && Object.keys(params).length > 0) {
        url = url.replace(/:(\\w+)/g, (match, key) => {
            const value = params[key];
            if (value) {
                return value;
            }
            return match;
        });
    }
    `
    }

    ${
      this.query.length > 0 &&
      `
    if (query && Object.keys(query).length > 0) {
        url += '?' + Object.keys(query).map(key => key + '=' + query[key]).join('&');
    }
    `
    }
    
    ${
      this.body.some(item => item.type === 'File')
        ? `
    const request = new FormData();
${this.body
  .map(
    item => `
    if (body && body.${item.name}) {
        request.append('${item.name}', body.${item.name});
    }
`,
  )
  .join('\n')}
    `
        : `
    const request = body;
    `
    }

    const response = await axios.${this.method}(url, request);

    return response.data;
}
`;
  }
  async writeFile(dest) {
    const filePath = path_1.default.join(dest, `${this.name}.ts`);
    const source = `
        ${this.getImportSource()}
        ${this.getTypescriptInterface()}
        ${this.getExecutor()}
        `;
    await fs.writeFile(filePath, source);
  }
  get interfaceName() {
    return this.name[0].toUpperCase() + this.name.slice(1);
  }
}
exports.APITreeItem = APITreeItem;
class Parameter {
  constructor(item) {
    this.name = item.key;
    this.type = __classPrivateFieldGet(
      Parameter,
      _b,
      'm',
      _Parameter_getType,
    ).call(Parameter, item.type);
    this.required = !item.nullable && !item.default;
  }
  getTypescriptInterface() {
    return `${this.name}${this.required ? '?' : ''}: ${
      this.type === 'File' ? 'unknown' : this.type
    }`;
  }
}
exports.Parameter = Parameter;
(_b = Parameter),
  (_Parameter_getType = function _Parameter_getType(type) {
    switch (type) {
      case 'array':
        return 'unknown[]';
      case 'file':
        return 'File';
      case 'none':
        return 'unknown';
      case 'object':
        return 'Record<string, unknown>';
      default:
        return type;
    }
  });
