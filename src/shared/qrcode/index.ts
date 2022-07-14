import FormData from 'form-data';
import QRCode from 'qrcode';

interface QRCodeData {
  qrFormData: FormData;
  base64: Buffer;
}

interface IQrCode {
  target: string;
  fileName: string | undefined;
}

interface QrCodesResponse {
  success: Array<QRCodeData>;
  failure: Array<IQrCode>;
}

class QrCode {
  public async createQRCodeData(props: IQrCode): Promise<QRCodeData | undefined> {
    try {
      const qrCode = await QRCode.toDataURL(props.target, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
      });
      const base64Data = Buffer.from(qrCode.replace(/^data:image\/\w+;base64,/, ''), 'base64');

      const formData = new FormData();
      formData.append('file', base64Data, props.fileName ?? 'qrCode.png');

      return {
        qrFormData: formData,
        base64: base64Data,
      };
    } catch (err) {
      return undefined;
    }
  }

  public async createQrCodesData(props: Array<IQrCode>): Promise<QrCodesResponse> {
    const result: QrCodesResponse = { success: [], failure: [] };

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

export { QrCode };
