export interface ICreateResponseProps<T = any> {
  skip?: number;
  take?: number;
  count?: number;
  data?: Array<T> | T;
}

export const createResponse = (props: ICreateResponseProps) => {
  const { skip, take, count, data } = props;

  if (count && Array.isArray(data)) {
    if (typeof skip !== 'number' || typeof take !== 'number') {
      return { count, rows: data };
    }

    const page = skip / take + 1;
    const isPrev = page !== 1;
    const isNext = skip + take < count;

    return {
      pagination: {
        skip,
        take,
        count,
        page,
        limit: take,
        isPrev,
        isNext,
      },
      count,
      rows: data,
    };
  } else {
    return { row: data };
  }
};
