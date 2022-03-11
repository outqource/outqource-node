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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseMessaging = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class FirebaseMessaging {
    constructor(serviceAccount) {
        this.app = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
        });
    }
    sendMessage({ token, notification }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.app.messaging().send({
                    token,
                    notification,
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    sendMessages(messages) {
        var messages_1, messages_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = { success: [], failure: [] };
            try {
                for (messages_1 = __asyncValues(messages); messages_1_1 = yield messages_1.next(), !messages_1_1.done;) {
                    const message = messages_1_1.value;
                    const messageResult = yield this.sendMessage({
                        token: message.token,
                        notification: message.notification,
                    });
                    if (messageResult) {
                        result.success.push(message);
                    }
                    else {
                        result.failure.push(message);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (messages_1_1 && !messages_1_1.done && (_a = messages_1.return)) yield _a.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
}
exports.FirebaseMessaging = FirebaseMessaging;
