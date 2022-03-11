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
exports.Kakao = void 0;
const axios_1 = __importDefault(require("axios"));
const query_string_1 = __importDefault(require("query-string"));
const constant_1 = __importDefault(require("./constant"));
const { KAKAO } = constant_1.default;
class Kakao {
    constructor(client_id, client_secret, redirect_url) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_url = redirect_url;
        this.api = axios_1.default.create({
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });
    }
    getToken(code, redirectUri) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const data = query_string_1.default.stringify({
                grant_type: "authorization_code",
                client_id: this.client_id,
                client_secret: this.client_secret,
                redirectUri: redirectUri || this.redirect_url,
                code,
            });
            try {
                const response = yield this.api.post(KAKAO.TOKEN_URL, data);
                const token = (_a = response.data) === null || _a === void 0 ? void 0 : _a.access_token;
                return token;
            }
            catch (error) {
                return null;
            }
        });
    }
    getUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            };
            try {
                const response = yield this.api.get(KAKAO.USER_URL, { headers });
                const { id, properties, kakao_account: kakaoAccount } = response.data;
                const { nickname, profile_image: profileImage } = properties;
                const { email } = kakaoAccount;
                return {
                    id,
                    email,
                    nickname,
                    profileImage,
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    getUserWithToken(code, redirect_uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getToken(code, redirect_uri);
            if (!token) {
                return {
                    status: 400,
                    message: "카카오 토큰 발급 오류!",
                };
            }
            const user = yield this.getUser(token);
            if (!user) {
                return {
                    status: 500,
                    message: "카카오 유저정보 발급 오류!",
                };
            }
            return {
                status: 200,
                message: "성공",
                data: { token, user },
            };
        });
    }
}
exports.Kakao = Kakao;
