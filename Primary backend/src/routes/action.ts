import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const  app=Router();
const prisma=new PrismaClient();
app.get("/action",async(req:any,res:any)=>{
    const triggers=await prisma.actionavailable.findMany({});
    res.send({triggers,status:2000});
})
export const availabaction=app;