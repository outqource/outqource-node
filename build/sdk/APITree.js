'use strict';
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
    if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError('Cannot read private member from an object whose class did not declare it');
    return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
var _a, _Parameter_getType;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Parameter = exports.APITreeItem = void 0;
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
  writeFile() {
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
