import axios, { Method, AxiosInstance, AxiosRequestHeaders, AxiosResponse, AxiosError } from 'axios';
import queryString from 'query-string';

export interface onRequestProps {
  instance?: AxiosInstance;
  url: string;
  method: Method;
  query?: Record<string, any>;
  data?: any;
  headers?: AxiosRequestHeaders;
}

export const onRequest = async ({
  instance = axios,
  url,
  method,
  query,
  data,
  headers,
}: onRequestProps): Promise<AxiosResponse | AxiosError> => {
  try {
    if (query) {
      url = `${url}?${queryString.stringify(query)}`;
    }

    return await instance({
      method,
      url,
      data,
      headers,
    });
  } catch (error) {
    const e = error as AxiosError;
    return e;
  }
};
