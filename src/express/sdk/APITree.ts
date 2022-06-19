import * as fs from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { ControllerAPI, ValidationItemType, ValidatorItem } from '../';

export default class APITree {
  readonly parent: string;
  readonly children: APITree[] = [];
  readonly items: APITreeItem[] = [];

  public constructor(parent: string) {
    this.parent = parent;
  }

  public static async create(parent: string, filePath: string): Promise<APITree> {
    const tree = new APITree(parent);

    const files = await fs.readdir(filePath);

    for await (const file of files) {
      const indexPath = path.join(filePath, file);
      const stat = await fs.stat(indexPath);
      if (stat.isDirectory()) {
        tree.children.push(await APITree.create(`${parent}/${file}`, indexPath));
      } else {
        const content = require(indexPath);

        const apiKey = Object.keys(content).find(key => key.endsWith('API'));

        if (!apiKey) {
          throw new Error(`Controller API not specified at: ${indexPath}`);
        }

        const api: ControllerAPI = content[apiKey];
        tree.items.push(new APITreeItem(api, apiKey));
      }
    }

    return tree;
  }

  static async #isExistPath(dest: string): Promise<boolean> {
    try {
      await fs.access(dest, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async writeFiles(dest: string) {
    if (!(await APITree.#isExistPath(dest))) {
      await fs.mkdir(dest);
    }

    await Promise.all([
      ...this.items.map(item => item.writeFile(path.join(dest, this.parent))),
      ...this.children.map(child => child.writeFiles(path.join(dest, this.parent))),
    ]);
  }
}

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
    return `
import axios from 'axios';
`;
  }

  public getTypescriptInterface(): string {
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

  public getExecutor(): string {
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

  public async writeFile(dest: string) {
    const filePath = path.join(dest, `${this.name}.ts`);
    const source = `
        ${this.getImportSource()}
        ${this.getTypescriptInterface()}
        ${this.getExecutor()}
        `;

    await fs.writeFile(filePath, source);
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
    return `${this.name}${this.required ? '?' : ''}: ${this.type === 'File' ? 'unknown' : this.type}`;
  }
}
