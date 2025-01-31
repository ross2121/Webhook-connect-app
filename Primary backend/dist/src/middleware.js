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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const string = process.env.JWT_SECRET;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("shhe");
    try {
        if (!req.headers.authorization) {
            throw new Error("Authantication error");
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Authoriazation error");
        }
        const decode = jsonwebtoken_1.default.verify(token, string);
        // @ts-ignore
        req.id = decode.id;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(402).json({ error });
    }
});
exports.auth = auth;
