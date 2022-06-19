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
const Generator_1 = __importDefault(require("./Generator"));
if (require.main === module) {
    const root = process.argv[2];
    const dest = process.argv[3];
    if (!root || !dest) {
        console.error("Usage: npx outqource-node <root> <dest>");
        process.exit(1);
    }
    generate(root, dest).then(() => {
        console.log("Done");
    });
}
function generate(root, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Generator_1.default.generate(root, dest);
    });
}
exports.default = generate;
