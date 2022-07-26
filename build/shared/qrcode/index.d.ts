/// <reference types="node" />
import FormData from 'form-data';
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
declare class QrCode {
  createQRCodeData(props: IQrCode): Promise<QRCodeData | undefined>;
  createQrCodesData(props: Array<IQrCode>): Promise<QrCodesResponse>;
}
export { QrCode };
