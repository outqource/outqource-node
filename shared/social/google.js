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
class Google {
    static getUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
                const { id, email, name: nickname, picture: profileImage, } = response.data;
                return {
                    id,
                    email,
                    nickname,
                    profileImage,
                };
            }
            catch (error) {
                const { response } = error;
                if (response.data.error === "invalid_token")
                    throw { status: 403, message: "GOOGLE_TOKEN_EXPIRED" };
                return undefined;
            }
        });
    }
}
exports.Google = Google;
