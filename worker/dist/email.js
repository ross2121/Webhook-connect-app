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
exports.transportmail = void 0;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transportmail = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.password
    },
    port: 465,
    secure: false,
    host: 'smtp.gmail.com'
});
function sendEmail(to, body) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.transportmail.sendMail({
            from: "youvalsingh40@gmail.com",
            sender: "youvalsingh40@gmail.com",
            to,
            subject: "Hello from Zapier",
            text: body
        });
    });
}
