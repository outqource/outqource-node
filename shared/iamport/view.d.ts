export interface getRequestPaymentHTMLProps {
    title?: string;
    pg?: string;
    merchant_id?: string;
    pay_method: string;
    merchant_uid: string;
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
    imp_uid?: string;
    merchant_uid: string;
    buttonText?: string;
    buttonWrapperStyle?: object | string;
    buttonStyle?: object | string;
    [key: string]: any;
}
export declare const getRequestPaymentHTML: ({ title, merchant_id, buttonText, buttonWrapperStyle, buttonStyle, ...props }: getRequestPaymentHTMLProps) => string;
export declare const getCertificationHTML: ({ title, imp_uid, merchant_uid, buttonText, buttonWrapperStyle, buttonStyle, ...props }: getRequestCertifcationHTML) => string;
