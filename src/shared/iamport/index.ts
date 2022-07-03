/* eslint-disable no-case-declarations */
import axios from 'axios';
import type { Iamport as IamportTypes } from './types';
import {
  getCertificationHTML,
  getRequestCertifcationHTML,
  getRequestPaymentHTML,
  getRequestPaymentHTMLProps,
} from './view';

const api = axios.create({
  baseURL: 'https://api.iamport.kr',
});

class Iamport {
  private imp_key?: string;
  private imp_secret?: string;
  private merchant_id?: string;
  private pg?: string;

  constructor({ imp_key, imp_secret, merchant_id, pg }: IamportTypes.constructor) {
    this.imp_key = imp_key;
    this.imp_secret = imp_secret;
    this.merchant_id = merchant_id;
    this.pg = pg;
  }

  // 액세스 토큰 얻기
  async getToken({ imp_key, imp_secret }: IamportTypes.getToken): Promise<string | null> {
    if (!imp_key && !imp_secret && !this.imp_key && !this.imp_secret) {
      throw 'Invalid Key';
    }

    const data = {
      imp_key: imp_key || this.imp_key,
      imp_secret: imp_secret || this.imp_secret,
    };
    const headers = { 'Content-Type': 'application/json' };

    try {
      const response = await api.post('/users/getToken', data, { headers });
      const { access_token } = response.data.response;
      return access_token;
    } catch (error) {
      return null;
    }
  }

  // 결제 정보 얻기
  async getPaymentData({ access_token, imp_uid }: IamportTypes.getPaymentData): Promise<any | null> {
    const headers = { Authorization: access_token };

    try {
      const response = await api.get(`/payments/${imp_uid}`, { headers });
      const data = response.data.response;

      return data;
    } catch (error) {
      return null;
    }
  }

  // 결제창 서버에서 호출
  getPaymentHTML(props: getRequestPaymentHTMLProps): string | null {
    // 상품 ID 없으면 에러
    if (!this.merchant_id && !props.merchant_id) {
      return null;
    }

    // PG 아이디 없으면 에러
    if (!this.pg && !props.pg) {
      return null;
    }

    return getRequestPaymentHTML({
      ...props,
      title: props.title || '결제하기',
      merchant_id: props.merchant_id ?? this.merchant_id,
      pg: props.pg || this.pg,
    });
  }

  // 토큰 발급 & 결제 정보 얻기
  async getPaymentDataWithAccessToken({
    imp_key,
    imp_secret,
    imp_uid,
  }: IamportTypes.getPaymentDataWithAccessToken): Promise<any | string> {
    try {
      const access_token = await this.getToken({ imp_key, imp_secret });
      if (!access_token) {
        throw 'Invalid AccessToken';
      }

      const data = await this.getPaymentData({ access_token, imp_uid });
      if (!data) {
        throw 'Invalid Payment Data';
      }

      return { ...data, access_token };
    } catch (error) {
      return error;
    }
  }

  // 결제 완료 체크
  async completePayment({
    imp_key,
    imp_secret,
    imp_uid,
    productAmount,
  }: IamportTypes.completePayment): Promise<IamportTypes.TcompletePayment> {
    const paymentData = await this.getPaymentDataWithAccessToken({
      imp_key,
      imp_secret,
      imp_uid,
    });

    // payment data 제대로 불러오지 못했을 경우
    if (typeof paymentData === 'string') {
      return { status: 400, message: '결제 정보를 불러올 수 없습니다' };
    }

    // 가격이 string일 경우 number로 변경
    if (typeof productAmount === 'string') {
      productAmount = Number(productAmount);
    }

    const { amount, status } = paymentData;
    if (Number(amount) === productAmount) {
      switch (status) {
        case 'ready': // 가상계좌 발급
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          return {
            status: 200,
            message: '가상계좌 발급 성공',
            completeStatus: status,
            data: { vbank_num, vbank_date, vbank_name },
          };
        case 'paid': // 결제 완료
          return {
            status: 200,
            message: '일반 결제 성공',
            completeStatus: status,
            data: { amount, productAmount },
          };
        default:
          return { status: 400, message: '결제 실패' };
      }
    } else {
      return { status: 400, message: '위조된 결제시도' };
    }
  }

  // 카드 환불
  async cancelPayment({
    imp_key,
    imp_secret,
    imp_uid,
    reason,
    cancelAmount,
  }: IamportTypes.cancelPayment): Promise<any | null> {
    const paymentData = await this.getPaymentDataWithAccessToken({
      imp_key,
      imp_secret,
      imp_uid,
    });

    // payment data 제대로 불러오지 못했을 경우
    if (typeof paymentData === 'string') {
      return { status: 400, message: '결제 정보를 불러올 수 없습니다' };
    }

    // 가격이 string 일 경우 number로 치환
    if (typeof cancelAmount === 'string') {
      cancelAmount = Number(cancelAmount);
    }

    const { amount, cancel_amount } = paymentData;
    const cancelAbleAmount = amount - cancel_amount;
    if (cancelAbleAmount <= 0) {
      return null;
    }

    const data = {
      reason: reason || '',
      imp_uid,
      amount: cancelAmount,
      checksum: cancelAbleAmount,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: paymentData.access_token,
    };

    const response = await api.post('/payments/cancel', data, { headers });
    return response.data.response;
  }

  async getCeritifcationHTMLData(props: getRequestCertifcationHTML): Promise<string | null> {
    if (!this.merchant_id && !props.merchant_uid) return null;

    return getCertificationHTML({
      ...props,
      imp_uid: props.imp_uid,
      merchant_uid: props.merchant_uid ?? this.merchant_id,
    });
  }

  // 휴대폰 본인인증 정보 얻기
  async getCertificationData({ access_token, imp_uid }: IamportTypes.getCertificationData): Promise<any | null> {
    const headers = { Authorization: access_token };

    try {
      const response = await api.get(`/certifications/${imp_uid}`, { headers });
      const data = response.data.response;

      return data;
    } catch (error) {
      return null;
    }
  }

  // 휴대폰 본인인증 토큰 발급과 함께 얻기
  async getCeritificationDataWithAccessToken({
    imp_key,
    imp_secret,
    imp_uid,
  }: IamportTypes.getCeritificationDataWithAccessToken) {
    try {
      const access_token = await this.getToken({ imp_key, imp_secret });
      if (!access_token) {
        throw 'Invalid AccessToken';
      }

      const data = await this.getCertificationData({ access_token, imp_uid });
      if (!data) {
        throw 'Invalid Payment Data';
      }

      return { ...data, access_token };
    } catch (error) {
      return error;
    }
  }
}

export { Iamport };
