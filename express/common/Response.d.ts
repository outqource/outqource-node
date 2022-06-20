export interface ICreateResponseProps<T = any> {
  skip?: number;
  take?: number;
  count?: number;
  data?: Array<T> | T;
}
export declare const createResponse: (props: ICreateResponseProps) =>
  | {
      count: number;
      rows: any[];
      pagination?: undefined;
      row?: undefined;
    }
  | {
      pagination: {
        skip: number;
        take: number;
        count: number;
        page: number;
        limit: number;
        isPrev: boolean;
        isNext: boolean;
      };
      count: number;
      rows: any[];
      row?: undefined;
    }
  | {
      row: any;
      count?: undefined;
      rows?: undefined;
      pagination?: undefined;
    };
