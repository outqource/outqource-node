import { ControllerAPI, ValidatorItem } from '../express';
export declare type SDKSource = {
  name: string;
  source: string;
  importSource: string;
  typescriptInterfaceSource: string;
  executorSource: string;
};
export declare type SDKSources = Record<string, SDKSource>;
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
  writeFile(): SDKSource;
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
