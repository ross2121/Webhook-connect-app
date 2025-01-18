import { Kafka } from "kafkajs"
import { PrismaClient } from "@prisma/client"
const prisma=new PrismaClient();
const kafkaevent=new Kafka({
    clientId:"producer",
    brokers:["localhost:9092"]
})
async function main(){
    const producer=kafkaevent.producer();
    await producer.connect();
    const topic="zapier";
    while(1){
        const pendingrows=await prisma.zapoutbox.findMany({
            where:{
            },
            take:10,
        })
            await producer.send({
                topic,
                messages:pendingrows.map(row=>{
                    return{
                        value:JSON.stringify({zaprunid:row.zaprunid,stage:0})
                    }
                })
            })
            await prisma.zapoutbox.deleteMany({
                where:{
                    id:{
                        in:pendingrows.map(row=>row.id)
                    }
                }
            })
            await new Promise((resolve)=>setTimeout(resolve,1000));
            // await new Promise((resolve)=>setTimeout(resolve,1000));
    }
  

}
main();