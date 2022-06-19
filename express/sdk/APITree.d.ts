import { ControllerAPI, ValidatorItem } from '../';
export default class APITree {
  #private;
  readonly parent: string;
  readonly children: APITree[];
  readonly items: APITreeItem[];
  constructor(parent: string);
  static create(parent: string, filePath: string): Promise<APITree>;
  writeFiles(dest: string): Promise<void>;
}
export declare class APITreeItem {
  readonly name: string;
  readonly path: string;
  readonly method: string;
  readonly summary: string | undefined;
  param: Parameter[];
  query: Parameter[];
  body: Parameter[];
  constructor(api: ControllerAPI, name: string);
  getImportSource(): string;
  getTypescriptInterface(): string;
  getExecutor(): string;
  writeFile(dest: string): Promise<void>;
  private get interfaceName();
}
export declare class Parameter {
  #private;
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  constructor(item: ValidatorItem);
  getTypescriptInterface(): string;
}
