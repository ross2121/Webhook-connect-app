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
const kafkajs_1 = require("kafkajs");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const kafkaevent = new kafkajs_1.Kafka({
    clientId: "producer",
    brokers: ["localhost:9092"]
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafkaevent.producer();
        yield producer.connect();
        const topic = "zapier";
        while (1) {
            const pendingrows = yield prisma.zapoutbox.findMany({
                where: {},
                take: 10,
            });
            yield producer.send({
                topic,
                messages: pendingrows.map(row => {
                    return {
                        value: JSON.stringify({ zaprunid: row.zaprunid, stage: 0 })
                    };
                })
            });
            yield prisma.zapoutbox.deleteMany({
                where: {
                    id: {
                        in: pendingrows.map(row => row.id)
                    }
                }
            });
            yield new Promise((resolve) => setTimeout(resolve, 1000));
        }
    });
}
main();
