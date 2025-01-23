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
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.trigeredavailable.create({
            data: {
                id: "webhook",
                "name": "Webhook",
                "image": "https://i.sstatic.net/S3SNU.jpgs",
            }
        });
        yield prismaClient.actionavailable.create({
            data: {
                id: "send-sol",
                name: "Send solana",
                image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
            }
        });
        yield prismaClient.actionavailable.create({
            data: {
                id: "email",
                "name": "E-mail",
                "image": "https://www.pcworld.com/wp-content/uploads/2023/04/gmail_logo-100758589-orig.jpg?quality=50&strip=all"
            }
        });
    });
}
main();
