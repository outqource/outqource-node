export declare type ParseDataType = 'string' | 'boolean' | 'number' | 'json';
export declare const parseAutoValue: (value: string) => any;
export declare const parseValue: (
  value: string,
  type?: ParseDataType | string | 'auto',
) => any;
