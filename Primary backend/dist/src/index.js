"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const zap_1 = require("./routes/zap");
const trigger_1 = require("./routes/trigger");
const action_1 = require("./routes/action");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/v1/auth", user_1.userroute);
app.use("/v1/zap", middleware_1.auth, zap_1.zaproute);
app.use("/v1/trigger", middleware_1.auth, trigger_1.triggeroute);
app.use("/v1/action", middleware_1.auth, action_1.availabaction);
app.listen(3002, () => {
    console.log("Server is running at 3002");
});
