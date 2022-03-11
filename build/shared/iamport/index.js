"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iamport = void 0;
/* eslint-disable no-case-declarations */
const axios_1 = __importDefault(require("axios"));
const view_1 = require("./view");
const api = axios_1.default.create({
    baseURL: "https://api.iamport.kr",
});
class Iamport {
    constructor({ imp_key, imp_secret, merchant_id, pg, }) {
        this.imp_key = imp_key;
        this.imp_secret = imp_secret;
        this.merchant_id = merchant_id;
        this.pg = pg;
    }
    // 액세스 토큰 얻기
    getToken({ imp_key, imp_secret, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!imp_key && !imp_secret && !this.imp_key && !this.imp_secret) {
                throw "Invalid Key";
            }
            const data = {
                imp_key: imp_key || this.imp_key,
                imp_secret: imp_secret || this.imp_secret,
            };
            const headers = { "Content-Type": "application/json" };
            try {
                const response = yield api.post("/users/getToken", data, { headers });
                const { access_token } = response.data.response;
                return access_token;
            }
            catch (error) {
                return null;
            }
        });
    }
    // 결제 정보 얻기
    getPaymentData({ access_token, imp_uid, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { Authorization: access_token };
            try {
                const response = yield api.get(`/payments/${imp_uid}`, { headers });
                const data = response.data.response;
                return data;
            }
            catch (error) {
                return null;
            }
        });
    }
    // 결제창 서버에서 호출
    getPaymentHTML(props) {
        // 상품 ID 없으면 에러
        if (!this.merchant_id && !props.merchant_id) {
            return null;
        }
        // PG 아이디 없으면 에러
        if (!this.pg && !props.pg) {
            return null;
        }
        return (0, view_1.getRequestPaymentHTML)(Object.assign(Object.assign({}, props), { title: props.title || "결제하기", merchant_id: props.merchant_id || this.merchant_id, pg: props.pg || this.pg }));
    }
    // 토큰 발급 & 결제 정보 얻기
    getPaymentDataWithAccessToken({ imp_key, imp_secret, imp_uid, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const access_token = yield this.getToken({ imp_key, imp_secret });
                if (!access_token) {
                    throw "Invalid AccessToken";
                }
                const data = yield this.getPaymentData({ access_token, imp_uid });
                if (!data) {
                    throw "Invalid Payment Data";
                }
                return Object.assign(Object.assign({}, data), { access_token });
            }
            catch (error) {
                return error;
            }
        });
    }
    // 결제 완료 체크
    completePayment({ imp_key, imp_secret, imp_uid, productAmount, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentData = yield this.getPaymentDataWithAccessToken({
                imp_key,
                imp_secret,
                imp_uid,
            });
            // payment data 제대로 불러오지 못했을 경우
            if (typeof paymentData === "string") {
                return { status: 400, message: "결제 정보를 불러올 수 없습니다" };
            }
            // 가격이 string일 경우 number로 변경
            if (typeof productAmount === "string") {
                productAmount = Number(productAmount);
            }
            const { amount, status } = paymentData;
            if (Number(amount) === productAmount) {
                switch (status) {
                    case "ready": // 가상계좌 발급
                        const { vbank_num, vbank_date, vbank_name } = paymentData;
                        return {
                            status: 200,
                            message: "가상계좌 발급 성공",
                            completeStatus: status,
                            data: { vbank_num, vbank_date, vbank_name },
                        };
                    case "paid": // 결제 완료
                        return {
                            status: 200,
                            message: "일반 결제 성공",
                            completeStatus: status,
                            data: { amount, productAmount },
                        };
                    default:
                        return { status: 400, message: "결제 실패" };
                }
            }
            else {
                return { status: 400, message: "위조된 결제시도" };
            }
        });
    }
    // 카드 환불
    cancelPayment({ imp_key, imp_secret, imp_uid, reason, cancelAmount, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentData = yield this.getPaymentDataWithAccessToken({
                imp_key,
                imp_secret,
                imp_uid,
            });
            // payment data 제대로 불러오지 못했을 경우
            if (typeof paymentData === "string") {
                return { status: 400, message: "결제 정보를 불러올 수 없습니다" };
            }
            // 가격이 string 일 경우 number로 치환
            if (typeof cancelAmount === "string") {
                cancelAmount = Number(cancelAmount);
            }
            const { amount, cancel_amount } = paymentData;
            const cancelAbleAmount = amount - cancel_amount;
            if (cancelAbleAmount <= 0) {
                return null;
            }
            const data = {
                reason: reason || "",
                imp_uid,
                amount: cancelAmount,
                checksum: cancelAbleAmount,
            };
            const headers = {
                "Content-Type": "application/json",
                Authorization: paymentData.access_token,
            };
            const response = yield api.post("/payments/cancel", data, { headers });
            return response.data.response;
        });
    }
}
exports.Iamport = Iamport;
