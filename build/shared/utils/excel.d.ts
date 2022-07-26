/// <reference types="node" />
import ExcelJS from 'exceljs';
declare type TStatisticExcel = {
  header: string;
  data: Array<string>;
  extra?: {
    title: string;
    headers: Array<string>;
    extraData: Array<string>;
  };
};
export declare const getDefaultExcelSheet: (
  data: Record<string, any>,
  convertHeader: (header: string) => string,
) => Array<TStatisticExcel>;
export declare const convertExcelFile: (rows: TStatisticExcel[]) => Promise<ExcelJS.Buffer>;
export declare const getExcelFile: (
  data: Record<string, any>,
  convertHeader: (header: string) => string,
) => Promise<ExcelJS.Buffer>;
export {};
