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
exports.availabaction = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const app = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
app.get("/action", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const triggers = yield prisma.actionavailable.findMany({});
    res.send({ triggers, status: 2000 });
}));
exports.availabaction = app;
