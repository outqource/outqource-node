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
exports.Google = void 0;
const axios_1 = __importDefault(require("axios"));
const constant_1 = __importDefault(require("./constant"));
const { GOOGLE } = constant_1.default;
class Google {
    constructor(client_id, client_secret, redirect_url) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_url = redirect_url;
    }
    getToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                client_id: this.client_id,
                client_secret: this.client_secret,
                redirect_uri: this.redirect_url,
                grant_type: "authorization_code",
                code,
            };
            try {
                const response = yield axios_1.default.post(GOOGLE.TOKEN_URL, data);
                const { access_token } = response.data;
                return access_token;
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
            };
            try {
                const response = yield axios_1.default.get(GOOGLE.USER_URL, {
                    headers,
                });
                const { id, email, name: nickname, picture: profileImage, } = response.data;
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
    getUserWithToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.getToken(code);
            if (!token) {
                return {
                    status: 500,
                    message: "구글 토큰 발급 오류!",
                };
            }
            const user = yield this.getUser(token);
            if (!user) {
                return {
                    status: 500,
                    message: "구글 사용자 가져오기 오류!",
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
exports.Google = Google;
