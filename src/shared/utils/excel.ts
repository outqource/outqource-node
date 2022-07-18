import ExcelJS from 'exceljs';

type TStatisticExcel = {
  header: string;
  data: Array<string>;
  extra?: {
    title: string;
    headers: Array<string>;
    extraData: Array<string>;
  };
};

export const getDefaultExcelSheet = (
  data: Record<string, any>,
  convertHeader: (header: string) => string,
): Array<TStatisticExcel> => {
  return Object.entries(data).map(([key, value]) => {
    if (typeof data[key] === 'object') {
      const extraHeaders: string[] = [];
      const extraData: string[] = [];
      Object.entries(data[key]).forEach(([header, value]) => {
        extraHeaders.push(convertHeader(header));
        extraData.push(`${value}`);
      });

      return {
        header: convertHeader(key),
        data: [`${value}`],
        extra: {
          headers: extraHeaders,
          extraData,
          title: convertHeader(key),
        },
      };
    } else
      return {
        header: convertHeader(key),
        data: [`${value}`],
      };
  });
};

export const convertExcelFile = async (rows: TStatisticExcel[]): Promise<ExcelJS.Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet();

  rows.forEach((row, index) => {
    if (row.extra) {
      const length = row.extra.headers.length;
      row.extra.headers.forEach((header, headerIndex) => {
        worksheet.getColumn(index * length + headerIndex - length).values = [
          row.extra?.title,
          header,
          row.extra?.extraData[headerIndex],
        ];
      });

      worksheet.mergeCells(1, index * length - length, 1, index * length - 1);
    } else {
      worksheet.getColumn(index + 1).values = [row.header, ...row.data];
    }
  });

  return await workbook.xlsx.writeBuffer();
};

export const getExcelFile = async (
  data: Record<string, any>,
  convertHeader: (header: string) => string,
): Promise<ExcelJS.Buffer> => {
  return await convertExcelFile(getDefaultExcelSheet(data, convertHeader));
};
