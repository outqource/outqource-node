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
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _a, _Parameter_getType;
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
      if (file.endsWith('index.ts')) continue;
      const indexPath = path_1.default.join(filePath, file);
      const stat = await fs.stat(indexPath);
      if (stat.isDirectory()) {
        tree.children.push(await APITree.create(`${parent}/${file}`, indexPath));
      } else {
        const content = await fs.readFile(indexPath, 'utf-8');
        const result = /export const (.+API): ControllerAPI = ({[^;]+);/.exec(content);
        if (!result) {
          throw new Error(`Controller API not specified at: ${indexPath}`);
        }
        const apiKey = result[1];
        const api = eval(`(function(){return ${result[2]}})()`);
        if (!apiKey) {
          throw new Error(`Controller API not specified at: ${indexPath}`);
        }
        tree.items.push(new APITreeItem(api, apiKey));
      }
    }
    return tree;
  }
  static isExistPath(dest) {
    return (0, fs_1.existsSync)(dest);
  }
  async writeFiles(dest, isFirst = false) {
    const childrenPath = path_1.default.join(dest, this.parent);
    let sources = {};
    for await (const item of this.items) {
      const { name, source } = await item.writeFile(childrenPath);
      sources[name] = source;
    }
    for await (const child of this.children) {
      const childSources = await child.writeFiles(childrenPath);
      sources = { ...sources, ...childSources };
    }
    return sources;
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
    if (api.param) this.param = api.param.map(item => new Parameter(item));
    if (api.query) this.query = api.query.map(item => new Parameter(item));
    if (api.body) this.body = api.body.map(item => new Parameter(item));
  }
  getImportSource() {
    return "import axios from 'axios';\n";
  }
  getTypescriptInterface() {
    return `
export interface ${this.interfaceName} {
    ${
      this.param.length > 0
        ? `params${this.param.every(item => item.required) ? '' : '?'}: {
        ${this.param.map(item => item.getTypescriptInterface()).join('\n')}
    }
`
        : ''
    }${
      this.query.length > 0
        ? `query${this.query.every(item => item.required) ? '' : '?'}: {
        ${this.query.map(item => item.getTypescriptInterface()).join('\n')}
    }
`
        : ''
    }${
      this.body.length > 0
        ? `body${this.body.every(item => item.required) ? '' : '?'}: {
        ${this.body.map(item => item.getTypescriptInterface()).join('\n')}
    }
`
        : ''
    }
}`;
  }
  getExecutor() {
    return `
export const ${this.name} = async (request: ${this.interfaceName}) => {
    let url = '${this.path}';${
      this.param.length > 0
        ? `
    if (request.params && Object.keys(request.params).length > 0) {
        url = url.replace(/:(\\w+)/g, (match, key) => {
            const value = request.params[key as keyof ${this.interfaceName}['params']];
            if (value) {
                return value;
            }
            return match;
        });
    }
`
        : ''
    }${
      this.query.length > 0
        ? `
    if (request.query && Object.keys(request.query).length > 0) {
        url += '?' + Object.keys(request.query).map(key => key + '=' + request.query[key]).join('&');
    }
`
        : ''
    }${
      this.body.some(item => item.type === 'File')
        ? `
    const req = new FormData();
${this.body
  .map(
    item => `
    if (request.body && request.body.${item.name}) {
        req.append('${item.name}', request.body.${item.name});
    }
`,
  )
  .join('\n')}
`
        : ''
    }
    const response = await axios.${this.method.toLowerCase()}(url, ${
      ['PUT', 'PATCH', 'POST'].includes(this.method)
        ? this.body.some(item => item.type === 'File')
          ? 'req'
          : 'request.body'
        : `{${
            this.param.length > 0
              ? `
            params: request.params,
            `
              : ''
          }${
            this.query.length > 0
              ? `query: request.query,
          `
              : ''
          }}`
    });

    return response.data;
};
`;
  }
  async writeFile(dest) {
    const importSource = this.getImportSource();
    const typescriptInterfaceSource = this.getTypescriptInterface();
    const executorSource = this.getExecutor();
    return {
      name: this.name,
      source: `${importSource}\n${typescriptInterfaceSource}\n${executorSource}`,
      importSource,
      typescriptInterfaceSource,
      executorSource,
    };
  }
  get interfaceName() {
    return this.name[0].toUpperCase() + this.name.slice(1);
  }
}
exports.APITreeItem = APITreeItem;
class Parameter {
  constructor(item) {
    this.name = item.key;
    this.type = __classPrivateFieldGet(Parameter, _a, 'm', _Parameter_getType).call(Parameter, item.type);
    this.required = !item.nullable && !item.default;
  }
  getTypescriptInterface() {
    console.log(`${this.name}: ${this.type} ${this.required}`);
    return `${this.name}${this.required ? '' : '?'}: ${this.type === 'File' ? 'unknown' : this.type}`;
  }
}
exports.Parameter = Parameter;
(_a = Parameter),
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