import { Method, AxiosInstance, AxiosRequestHeaders, AxiosResponse, AxiosError } from 'axios';
export interface onRequestProps {
  instance?: AxiosInstance;
  url: string;
  method: Method;
  query?: Record<string, any>;
  data?: any;
  headers?: AxiosRequestHeaders;
}
export declare const onRequest: ({
  instance,
  url,
  method,
  query,
  data,
  headers,
}: onRequestProps) => Promise<AxiosResponse | AxiosError>;
