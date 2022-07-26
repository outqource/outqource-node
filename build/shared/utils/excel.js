'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getExcelFile = exports.convertExcelFile = exports.getDefaultExcelSheet = void 0;
const exceljs_1 = __importDefault(require('exceljs'));
const getDefaultExcelSheet = (data, convertHeader) => {
  return Object.entries(data).map(([key, value]) => {
    if (typeof data[key] === 'object') {
      const extraHeaders = [];
      const extraData = [];
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
exports.getDefaultExcelSheet = getDefaultExcelSheet;
const convertExcelFile = async rows => {
  const workbook = new exceljs_1.default.Workbook();
  const worksheet = workbook.addWorksheet();
  rows.forEach((row, index) => {
    if (row.extra) {
      const length = row.extra.headers.length;
      row.extra.headers.forEach((header, headerIndex) => {
        var _a, _b;
        worksheet.getColumn(index * length + headerIndex - length).values = [
          (_a = row.extra) === null || _a === void 0 ? void 0 : _a.title,
          header,
          (_b = row.extra) === null || _b === void 0 ? void 0 : _b.extraData[headerIndex],
        ];
      });
      worksheet.mergeCells(1, index * length - length, 1, index * length - 1);
    } else {
      worksheet.getColumn(index + 1).values = [row.header, ...row.data];
    }
  });
  return await workbook.xlsx.writeBuffer();
};
exports.convertExcelFile = convertExcelFile;
const getExcelFile = async (data, convertHeader) => {
  return await (0, exports.convertExcelFile)((0, exports.getDefaultExcelSheet)(data, convertHeader));
};
exports.getExcelFile = getExcelFile;
