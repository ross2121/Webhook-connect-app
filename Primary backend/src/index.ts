import { Router} from "express";
import express from "express"
import cors from "cors"
import { userroute } from "./routes/user";
import { zaproute } from "./routes/zap";
import { triggeroute } from "./routes/trigger";
import { availabaction } from "./routes/action";
import { auth } from "./middleware";
const app=express();
app.use(cors())
app.use(express.json());
app.use("/v1/auth",userroute);
app.use("/v1/zap",auth,zaproute);
app.use("/v1/trigger",auth,triggeroute);
app.use("/v1/action",auth,availabaction);
app.listen(3000,()=>{
    console.log("Server is running at 3000");
})

