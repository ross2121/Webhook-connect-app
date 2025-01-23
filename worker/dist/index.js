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
const kafkajs_1 = require("kafkajs");
const parser_1 = require("./parser");
const email_1 = require("./email");
const solana_1 = require("./solana");
const prisma = new client_1.PrismaClient();
const TOPIC_NAME = "zapier";
const kafka = new kafkajs_1.Kafka({
    clientId: 'producer-2',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker-2' });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: false });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e, _f, _g, _h, _j;
                console.log({ topic, partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString() });
                if (!((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString())) {
                    console.log("no value found");
                    return;
                }
                const parsedmessge = JSON.parse((_d = message.value) === null || _d === void 0 ? void 0 : _d.toString());
                const zaprunid = parsedmessge.zaprunid;
                console.log(zaprunid, zaprunid);
                const stage = parsedmessge.stage;
                const zaprundetails = yield prisma.zaprun.findFirst({
                    where: {
                        id: zaprunid
                    },
                    include: {
                        zap: {
                            include: {
                                Action: {
                                    include: {
                                        actiontype: true
                                    }
                                }
                            }
                        }
                    }
                });
                console.log(zaprundetails);
                if (!zaprundetails) {
                    console.log("No zapdetail found");
                }
                const currentaction = zaprundetails === null || zaprundetails === void 0 ? void 0 : zaprundetails.zap.Action.find(x => x.SortingOrder === stage);
                if (!currentaction) {
                    return;
                }
                //    // You received {comment.amount} momey from {comment.link}
                //    parse(my name is {comment.name} my address is comment.addrss)",{
                // comment:{
                // name:"youval",
                // address:123232321
                // }"
                const zaprunmetadata = zaprundetails === null || zaprundetails === void 0 ? void 0 : zaprundetails.metadata;
                console.log(currentaction.actiontype.id.toString());
                // console.log(currentaction.actiontype);
                if ((currentaction.actiontype.id).toString() === "email") {
                    console.log("You are at email section");
                    const body = (0, parser_1.parse)((_e = currentaction.metaData) === null || _e === void 0 ? void 0 : _e.body, zaprunmetadata);
                    const to = (0, parser_1.parse)((_f = currentaction.metaData) === null || _f === void 0 ? void 0 : _f.email, zaprunmetadata);
                    // @ts-ignore
                    console.log("You are at email section");
                    yield (0, email_1.sendEmail)(to, body);
                }
                if (currentaction.actiontype.id === "send-sol") {
                    const amount = (0, parser_1.parse)((_g = currentaction.metaData) === null || _g === void 0 ? void 0 : _g.amount, zaprunmetadata);
                    const address = (0, parser_1.parse)((_h = currentaction.metaData) === null || _h === void 0 ? void 0 : _h.to, zaprunmetadata);
                    // @ts-ignore
                    console.log("You are at solana section");
                    yield (0, solana_1.sendSol)(address, amount);
                }
                yield new Promise(r => setTimeout(r, 500));
                console.log("last stage");
                const laststage = (((_j = zaprundetails === null || zaprundetails === void 0 ? void 0 : zaprundetails.zap.Action) === null || _j === void 0 ? void 0 : _j.length) || 1) - 1;
                if (laststage !== stage) {
                    console.log("check");
                    yield producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    zaprunid
                                })
                            }]
                    });
                }
                console.log("'commiit");
                yield consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }]);
                console.log("final lasst");
                //   await producer.send({
                //     topic,
                //     messages:pendingrows.map(row=>{
                //         return{
                //             value:JSON.stringify({zaprunid:row.zaprunid,stage:0})
                //         }
                //     })
                // })
            })
        });
    });
}
main();
