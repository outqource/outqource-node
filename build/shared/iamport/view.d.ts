export interface getRequestPaymentHTMLProps {
  title?: string;
  pg?: string;
  merchant_id: string;
  pay_method: string;
  merchant_uid: string;
  imp_uid: string;
  name: string;
  amount: number;
  buyer_email?: string;
  buyer_name?: string;
  buyer_tel?: string;
  buyer_addr?: string;
  buyer_postcode?: string;
  buttonText?: string;
  buttonWrapperStyle?: object | string;
  buttonStyle?: object | string;
  callback_url: string;
  done_redirect_uri: string;
  fail_redirect_uri: string;
}
export interface getRequestCertifcationHTML {
  title?: string;
  imp_uid: string;
  merchant_uid?: string;
  popup?: boolean;
  m_redirect_url?: string;
}
export declare const getRequestPaymentHTML: ({
  title,
  imp_uid,
  buttonText,
  buttonWrapperStyle,
  buttonStyle,
  ...props
}: getRequestPaymentHTMLProps) => string;
/**
 *     merchant_uid: "ORD20180131-0000011", // 주문 번호
    m_redirect_url : "{리디렉션 될 URL}", // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
    popup : false
 *
 */
export declare const getCertificationHTML: ({ title, imp_uid, ...props }: getRequestCertifcationHTML) => string;
