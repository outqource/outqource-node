import { ControllerAPI, ValidationItemType, ValidatorItem } from '../express';

export type SDKSource = {
  name: string;
  source: string;
  importSource: string;
  typescriptInterfaceSource: string;
  executorSource: string;
};

export type SDKSources = Record<string, SDKSource>;

export class APITreeItem {
  readonly name: string;
  readonly path: string;
  readonly method: string;
  readonly summary: string | undefined;
  public param: Parameter[] = [];
  public query: Parameter[] = [];
  public body: Parameter[] = [];
  // TODO: Response Type
  // readonly response: Response[];

  public constructor(api: ControllerAPI, name: string) {
    this.name = name.replace(/API$/, '');
    this.path = api.path;
    this.method = api.method;
    this.summary = api.summary;
    if (api.param) this.param = api.param.map(item => new Parameter(item));
    if (api.query) this.query = api.query.map(item => new Parameter(item));
    if (api.body) this.body = api.body.map(item => new Parameter(item));
  }

  public getImportSource(): string {
    return "import axios from 'axios';\n";
  }

  public getTypescriptInterface(): string {
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

  public getExecutor(): string {
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

  public writeFile(): SDKSource {
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

  private get interfaceName() {
    return this.name[0].toUpperCase() + this.name.slice(1);
  }
}

export class Parameter {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;

  public constructor(item: ValidatorItem) {
    this.name = item.key;
    this.type = Parameter.#getType(item.type);
    this.required = !item.nullable && !item.default;
  }

  static #getType(type: ValidationItemType): string {
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
  }

  public getTypescriptInterface(): string {
    return `${this.name}${this.required ? '' : '?'}: ${this.type === 'File' ? 'unknown' : this.type}`;
  }
}
