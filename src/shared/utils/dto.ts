import range from 'lodash/range';
import { ControllerAPIResponsStatusCode, ValidatorItem } from '../../openapi';

type EnumCheck<T> = T extends object ? T : 'string';

type ObjectValue<T> = T extends object
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

export type DTOToObject<T> = T extends Record<string, unknown>
  ? {
      [K in keyof Partial<T>]: ObjectValue<T[K]>;
    } & { [key: string]: any }
  : T extends null
  ?
      | {
          [K in keyof Partial<T>]: ObjectValue<T[K]>;
        }
      | null
  : any;

type TPagination = {
  page: number;
  limit: number;
  offset: number;
  isPrev: boolean;
  count: number;
  isNext: boolean;
};

export const getPagination = (take: number, skip: number, count: number): TPagination => {
  const limit = Number(take);
  const page = (Number(skip) % Number(take)) + 1;
  const offset = Number(skip);
  const isPrev = Number(page) <= 0;
  const isNext = page * limit < count;

  return {
    count,
    isNext,
    isPrev,
    limit,
    offset,
    page,
  };
};

export const paginationRequestDTO = (): ValidatorItem[] => {
  return [
    { key: 'page', type: 'number', default: 1, nullable: true },
    { key: 'limit', type: 'number', default: 20, nullable: true },
  ];
};

export const paginationDTO = {
  count: 'number',
  page: 'number',
  limit: 'number',
  offset: 'number',
  isPrev: 'boolean',
  isNext: 'boolean',
};

export const createPaginationResponsetDTO = <T>(data: T, status?: ControllerAPIResponsStatusCode) => ({
  status: status || 200,
  example: { pagination: paginationDTO, rows: range(0, 3).map(() => data) },
});

export const createDetailResponse = <T>(row: T, status?: ControllerAPIResponsStatusCode) => ({
  status: status || 200,
  example: { row },
});

export const createListResponse = <T>(rows: T, status?: ControllerAPIResponsStatusCode) => ({
  status: status || 200,
  example: { pagination: paginationDTO, rows: range(0, 3).map(() => rows) },
});

export const timeDTO: DTOToObject<{ createdAt: Date; updatedAt: Date; deletedAt?: Date }> = {
  createdAt: 'date',
  updatedAt: 'date',
  deletedAt: 'date | null',
};

export const tokenDTO = (status: ControllerAPIResponsStatusCode) => {
  return {
    status,
    example: {
      accessToken: 'string',
      refreshToken: 'string',
    },
  };
};

export const emptyResponse = (status: ControllerAPIResponsStatusCode) => {
  return {
    status,
    example: {},
  };
};

export const responseWithId = (status: ControllerAPIResponsStatusCode) => {
  return {
    status,
    example: { id: 'string' },
  };
};
