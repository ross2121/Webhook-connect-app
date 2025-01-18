"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zap = exports.usersingin = exports.UserRegister = void 0;
const zod_1 = require("zod");
exports.UserRegister = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(8)
});
exports.usersingin = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6).max(8)
});
exports.zap = zod_1.z.object({
    availableTriggerid: zod_1.z.string(),
    metadata: zod_1.z.string().optional(),
    action: zod_1.z.object({
        availabaction: zod_1.z.string(),
        metadata: zod_1.z.any().optional()
    })
});
