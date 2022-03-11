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
exports.Encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class Encrypt {
    constructor({ aes, saltRound }) {
        this.aesKey = aes;
        this.saltRound = saltRound;
    }
    hash(value, saltRound) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.saltRound && !saltRound) {
                return null;
            }
            return yield bcrypt_1.default.hash(value, (this.saltRound || saltRound));
        });
    }
    signAES(value) {
        if (!this.aesKey) {
            return null;
        }
        return crypto_js_1.default.AES.encrypt(value, this.aesKey).toString();
    }
    verifyAES(value) {
        if (!this.aesKey) {
            return null;
        }
        return crypto_js_1.default.AES.decrypt(value, this.aesKey).toString(crypto_js_1.default.enc.Utf8);
    }
}
exports.Encrypt = Encrypt;
