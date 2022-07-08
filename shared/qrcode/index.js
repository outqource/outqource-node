'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.QrCode = void 0;
const form_data_1 = __importDefault(require('form-data'));
const qrcode_1 = __importDefault(require('qrcode'));
class QrCode {
  async createQRCodeData(props) {
    var _a;
    try {
      const qrCode = await qrcode_1.default.toDataURL(props.target, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
      });
      const base64Data = Buffer.from(qrCode.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const formData = new form_data_1.default();
      formData.append('file', base64Data, (_a = props.fileName) !== null && _a !== void 0 ? _a : 'qrCode.png');
      return {
        qrFormData: formData,
        base64: base64Data,
      };
    } catch (err) {
      return undefined;
    }
  }
  async createQrCodesData(props) {
    const result = { success: [], failure: [] };
    for (const prop of props) {
      const qrCode = await this.createQRCodeData(prop);
      if (qrCode) {
        result.success.push(qrCode);
      } else {
        result.failure.push(prop);
      }
    }
    return result;
  }
}
exports.QrCode = QrCode;
