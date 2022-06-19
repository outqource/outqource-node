import { DotenvConfigOptions } from 'dotenv';
export declare type EnvType = 'string' | 'boolean' | 'number' | 'json' | 'auto';
export declare type ParseEnvProps =
  | {
      key: string;
      type?: EnvType;
    }
  | string;
export declare type ParseEnvListProps = Array<ParseEnvProps>;
export declare class ParseEnv {
  private env?;
  result?: any;
  flattenResult?: any;
  constructor(
    config: {
      env?: any;
      options?: DotenvConfigOptions;
      flat?: boolean;
    },
    props: ParseEnvListProps,
  );
  static checkJsonString: (value: any) => boolean;
  parseEnv(props: ParseEnvProps): any;
  parseAutoEnv(props: ParseEnvProps): any;
  parseEnvList(props: ParseEnvListProps): void;
  flatEnvList(splitKey?: string): void;
}
