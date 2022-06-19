import type { Iamport as IamportTypes } from './types';
import { getRequestPaymentHTMLProps } from './view';
declare class Iamport {
  private imp_key?;
  private imp_secret?;
  private merchant_id?;
  private pg?;
  constructor({
    imp_key,
    imp_secret,
    merchant_id,
    pg,
  }: IamportTypes.constructor);
  getToken({
    imp_key,
    imp_secret,
  }: IamportTypes.getToken): Promise<string | null>;
  getPaymentData({
    access_token,
    imp_uid,
  }: IamportTypes.getPaymentData): Promise<any | null>;
  getPaymentHTML(props: getRequestPaymentHTMLProps): string | null;
  getPaymentDataWithAccessToken({
    imp_key,
    imp_secret,
    imp_uid,
  }: IamportTypes.getPaymentDataWithAccessToken): Promise<any | string>;
  completePayment({
    imp_key,
    imp_secret,
    imp_uid,
    productAmount,
  }: IamportTypes.completePayment): Promise<IamportTypes.TcompletePayment>;
  cancelPayment({
    imp_key,
    imp_secret,
    imp_uid,
    reason,
    cancelAmount,
  }: IamportTypes.cancelPayment): Promise<any | null>;
  getCeritifcationHTML(): Promise<string>;
  getCertificationData({
    access_token,
    imp_uid,
  }: IamportTypes.getCertificationData): Promise<any | null>;
  getCeritificationDataWithAccessToken({
    imp_key,
    imp_secret,
    imp_uid,
  }: IamportTypes.getCeritificationDataWithAccessToken): Promise<any>;
}
export { Iamport };
