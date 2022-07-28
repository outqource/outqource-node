import { ControllerAPIResponsStatusCode, ValidatorItem } from '../../openapi';
declare type EnumCheck<T> = T extends object ? T : 'string';
declare type ObjectValue<T> = T extends object
  ? T extends Date
    ? 'date' | 'date | null'
    : keyof object
  : T extends string
  ? EnumCheck<T>
  : T extends string | null
  ? 'string | null'
  : T extends number
  ? 'number'
  : T extends number | null
  ? 'number | null'
  : T extends boolean
  ? 'boolean'
  : T extends boolean | null
  ? 'boolean | null'
  : T extends string[]
  ? 'string[]'
  : T extends string[] | null
  ? 'string[] | null'
  : T extends number[]
  ? 'number[]'
  : T extends number[] | null
  ? 'number[] | null'
  : T extends Record<string, unknown>
  ? DTOToObject<T>
  : T extends Record<string, unknown> | null
  ? DTOToObject<T | null>
  : T extends Record<string, unknown>[]
  ? DTOToObject<T[0]>[]
  : any;
export declare type DTOToObject<T> = T extends Record<string, unknown>
  ? {
      [K in keyof Partial<T>]: ObjectValue<T[K]>;
    } & {
      [key: string]: any;
    }
  : T extends null
  ?
      | {
          [K in keyof Partial<T>]: ObjectValue<T[K]>;
        }
      | null
  : any;
declare type TPagination = {
  page: number;
  limit: number;
  offset: number;
  isPrev: boolean;
  count: number;
  isNext: boolean;
};
export declare const getPagination: (take: number, skip: number, count: number) => TPagination;
export declare const paginationRequestDTO: () => ValidatorItem[];
export declare const paginationDTO: {
  count: string;
  page: string;
  limit: string;
  offset: string;
  isPrev: string;
  isNext: string;
};
export declare const createPaginationRequestDTO: <T>(
  data: T,
  status?: ControllerAPIResponsStatusCode | undefined,
) => {
  status: ControllerAPIResponsStatusCode;
  example: {
    pagination: {
      count: string;
      page: string;
      limit: string;
      offset: string;
      isPrev: string;
      isNext: string;
    };
    rows: T[];
  };
};
export declare const createDetailResponse: <T>(
  row: T,
  status?: ControllerAPIResponsStatusCode | undefined,
) => {
  status: ControllerAPIResponsStatusCode;
  example: {
    row: T;
  };
};
export declare const createListResponse: <T>(
  rows: T,
  status?: ControllerAPIResponsStatusCode | undefined,
) => {
  status: ControllerAPIResponsStatusCode;
  example: {
    pagination: {
      count: string;
      page: string;
      limit: string;
      offset: string;
      isPrev: string;
      isNext: string;
    };
    rows: T[];
  };
};
export declare const timeDTO: DTOToObject<{
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}>;
export declare const tokenDTO: (status: ControllerAPIResponsStatusCode) => {
  status: ControllerAPIResponsStatusCode;
  example: {
    accessToken: string;
    refreshToken: string;
  };
};
export declare const emptyResponse: (status: ControllerAPIResponsStatusCode) => {
  status: ControllerAPIResponsStatusCode;
  example: {};
};
export declare const responseWithId: (status: ControllerAPIResponsStatusCode) => {
  status: ControllerAPIResponsStatusCode;
  example: {
    id: string;
  };
};
export {};
