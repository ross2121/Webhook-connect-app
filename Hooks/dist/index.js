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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// https://zapier.com/editor/275340302/draft/275340302/setup
app.post("/zapier/:userid/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zapid = req.params.zapId;
    const userId = req.params.userid;
    const metadata = req.body;
    yield prisma.$transaction((ts) => __awaiter(void 0, void 0, void 0, function* () {
        const Mainzapid = yield ts.zaprun.create({
            data: {
                zapId: zapid,
                metadata
            }
        });
        yield ts.zapoutbox.create({
            data: {
                zaprunid: Mainzapid.id,
            }
        });
    }));
    res.json({ message: "webhook recived", status: 200 });
}));
app.listen(3000, () => {
    console.log("server is running at 3000");
});
