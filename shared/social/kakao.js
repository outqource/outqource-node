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
class Kakao {
    static getUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            };
            try {
                const response = yield axios_1.default.get("https://kapi.kakao.com/v2/user/me", {
                    headers,
                });
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
                return undefined;
            }
        });
    }
}
exports.Kakao = Kakao;
