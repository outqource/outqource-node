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
export declare const getExcelFile: (rows: TStatisticExcel[]) => Promise<ExcelJS.Buffer>;
export {};
