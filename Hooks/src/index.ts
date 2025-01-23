import { PrismaClient } from "@prisma/client";
import express from "express"
const app=express();
const prisma=new PrismaClient();
app.use(express.json());
// https://zapier.com/editor/275340302/draft/275340302/setup

app.post("/zapier/:userid/:zapId",async(req,res)=>{
    const zapid=req.params.zapId;
    const metadata=req.body;
    await prisma.$transaction(async (ts)=>{
        const Mainzapid=await ts.zaprun.create({
            data:{
                zapId:zapid,
                metadata
            }
        })
        await ts.zapoutbox.create({
            data:{
                zaprunid:Mainzapid.id,
            }
        })
    })
    res.json({message:"webhook recived",status:200});

})
app.listen(3000,()=>{
    console.log("server is running at 3000");
})
