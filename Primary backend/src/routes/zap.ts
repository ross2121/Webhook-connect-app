import { Router } from "express";
import { auth } from "../middleware";
import { zap } from "../types";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/zaps",auth,async (req:any,res:any)=> {
  const id = (req as any).id;
 
  const body = req.body;
  console.log(body);
 
  const parsedData = zap.safeParse(body);
  if (!parsedData.success) {
    return res.status(400).send({ message: "Incorrect inputs" });
  }
  try {
    const zapId = await prisma.$transaction(async (tx) => {
      const zap = await tx.zap.create({
        data: {
          userid: parseInt(id),
          trigerId: "",
          Action: {
            create: Array.isArray(parsedData.data.action)
              ? parsedData.data.action.map((x: any, index: number) => ({
                  actionId: x.availabaction,
                  SortingOrder: index,
                  metaData:x.metadata,
                }))
              : [],
          },
        },
      });
      console.log("zap done");
      const trigger=await tx.trigger.create({
        data:{
            Zapid:zap.id,
            // metaData:parsedData.data.action[0].metadata,
            trigerid:parsedData.data.availableTriggerid
        }
      })
       console.log("trigger done");
      await tx.zap.update({
        where:{
            id:zap.id
        },data:{
            trigerId:trigger.id
        }
      })
      return zap.id;

    });
    console.log("update done");



    return res.status(201).send({ zapId });
  } catch (error) {
    console.error("Error creating zap:", error); 
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/",auth,async (req,res)=>{
    const id=(req as any).id
    const zap=await prisma.zap.findMany({
        where:{
            userid:id
        },include:{
            Trigger:{
                include:{
                    AvailabeTrigger:true
                }
            },Action:{
                include:{
                    actiontype:true
                }
            }
        }
    })
    res.json({zap});
})
router.get("/:zapid",auth,async(req,res)=>{
    const ids=(req as any).id
    const zapidd=req.params;
    console.log(zapidd);
    const zap=await prisma.zap.findFirst({
        where:{
         id:zapidd.zapid,
         userid:ids
        },include:{
             Trigger:{
                include:{
                    AvailabeTrigger:true
                }
             },
             Action:{
                include:{
                    actiontype:true
                }
             }
        }

    })
    res.json({zap});
})

export const zaproute=router;
