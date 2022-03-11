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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken = (getUser) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            req.user = undefined;
            const headers = req.headers;
            const authorization = headers["authorization"] || headers["Authorization"];
            if ((authorization === null || authorization === void 0 ? void 0 : authorization.includes("Bearer")) ||
                (authorization === null || authorization === void 0 ? void 0 : authorization.includes("bearer"))) {
                if (typeof authorization === "string") {
                    const bearers = authorization.split(" ");
                    if (bearers.length === 2 && typeof bearers[1] === "string") {
                        const accessToken = bearers[1];
                        let user = undefined;
                        if (getUser) {
                            user = yield getUser(accessToken);
                        }
                        if (user) {
                            req.user = user;
                        }
                        else {
                            req.user = undefined;
                        }
                        next();
                    }
                    else {
                        next({ status: 400, message: "Authorization Fail" });
                    }
                }
                else {
                    next({ status: 400, message: "Authorization Fail" });
                }
            }
            else {
                next();
            }
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = jsonwebtoken;
