import { Router } from "express";
import { auth } from "../middleware";
import { zap } from "../types";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/",auth,async (req:any,res:any)=> {
  const id = (req as any).id;
  const body = req.body;

 
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
                  actionId: x.availableActionId,
                  SortingOrder: index,
                  metadata:x.actionMetadata,
                }))
              : [],
          },
        },
      });
      const trigger=await tx.trigger.create({
        data:{
            Zapid:zap.id,
            metaData:parsedData.data.action.metadata,
        trigerid:parsedData.data.availableTriggerid
             
        }
      })
      await prisma.zap.update({
        where:{
            id:zap.id
        },data:{
            trigerId:trigger.id
        }
      })
      return zap.id;

    });


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
    const id=(req as any).id
    const zapid=req.params
    const zap=await prisma.zap.findFirst({
        where:{
            userid:id,
            id:zapid,
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
