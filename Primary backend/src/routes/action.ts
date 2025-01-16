import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const  router=Router();
const prisma=new PrismaClient();
router.get("/action",async(res:any)=>{
    const action=await prisma.actionavailable.findMany({});
    res.send({action,status:200});
})
export const availabaction=router;