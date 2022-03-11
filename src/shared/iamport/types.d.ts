export namespace Iamport {
  export interface constructor {
    imp_key?: string;
    imp_secret?: string;
    merchant_id?: string; // imp00000000
    pg?: string; //tosstest
  }

  export type getToken = constructor;

  export interface getPaymentData {
    access_token: string;
    imp_uid: string;
  }

  export interface getPaymentDataWithAccessToken extends getToken {
    imp_uid: string;
  }

  export interface completePayment extends getPaymentDataWithAccessToken {
    productAmount: string | number;
  }

  export type TcompletePayment = {
    status: number;
    message: string;
    completeStatus?: string;
    data?: any;
  };

  export interface cancelPayment extends getPaymentDataWithAccessToken {
    reason?: string;
    cancelAmount: string | number;
  }
}
