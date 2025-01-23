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
exports.zaproute = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/zaps", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    console.log(id);
    const body = req.body;
    console.log(body);
    const parsedData = types_1.zap.safeParse(body);
    if (!parsedData.success) {
        return res.status(400).send({ message: "Incorrect inputs" });
    }
    try {
        const zapId = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zap = yield tx.zap.create({
                data: {
                    userid: parseInt(id),
                    trigerId: "",
                    Action: {
                        create: Array.isArray(parsedData.data.action)
                            ? parsedData.data.action.map((x, index) => ({
                                actionId: x.availabaction,
                                SortingOrder: index,
                                metaData: x.metadata,
                            }))
                            : [],
                    },
                },
            });
            const trigger = yield tx.trigger.create({
                data: {
                    Zapid: zap.id,
                    // metaData:parsedData.data.action[0].metadata,
                    trigerid: parsedData.data.availableTriggerid
                }
            });
            yield tx.zap.update({
                where: {
                    id: zap.id
                }, data: {
                    trigerId: trigger.id
                }
            });
            return zap.id;
        }));
        return res.status(201).send({ zapId });
    }
    catch (error) {
        console.error("Error creating zap:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}));
router.get("/", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const zap = yield prisma.zap.findMany({
        where: {
            userid: id
        }, include: {
            Trigger: {
                include: {
                    AvailabeTrigger: true
                }
            }, Action: {
                include: {
                    actiontype: true
                }
            }
        }
    });
    res.json({ zap });
}));
router.get("/:zapid", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.id;
    const zapidd = req.params;
    const zap = yield prisma.zap.findFirst({
        where: {
            id: zapidd.zapid,
            userid: ids
        }, include: {
            Trigger: {
                include: {
                    AvailabeTrigger: true
                }
            },
            Action: {
                include: {
                    actiontype: true
                }
            }
        }
    });
    res.json({ zap });
}));
exports.zaproute = router;
