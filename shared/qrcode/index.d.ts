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
interface QrCdoesResponse {
  success: Array<QRCodeData | null>;
  failure: Array<IQrCode | null>;
}
declare class QrCode {
  createQRCodeData(props: IQrCode): Promise<QRCodeData | undefined>;
  createQrCodesData(props: Array<IQrCode>): Promise<QrCdoesResponse>;
}
export { QrCode };
