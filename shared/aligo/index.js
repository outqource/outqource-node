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
exports.Aligo = void 0;
const axios_1 = __importDefault(require("axios"));
class Aligo {
    constructor(userId, key, sender) {
        this.userId = userId;
        this.key = key;
        this.sender = sender;
    }
    sendMessage({ phoneNumber, message, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = { "Content-Type": "application/x-www-form-urlencoded" };
            const params = new URLSearchParams();
            params.append("user_id", this.userId);
            params.append("key", this.key);
            params.append("sender", this.sender);
            params.append("receiver", phoneNumber);
            params.append("msg", message);
            params.append("msg_type", "SMS");
            try {
                yield axios_1.default.post("https://apis.aligo.in/send/", params, { headers });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    sendMessages(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = { success: [], failure: [] };
            for (const prop of props) {
                const response = yield this.sendMessage(prop);
                if (response) {
                    result.success.push(prop);
                }
                else {
                    result.failure.push(prop);
                }
            }
            return result;
        });
    }
}
exports.Aligo = Aligo;
