import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import {Kafka} from "kafkajs"
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prisma=new PrismaClient();
const TOPIC_NAME="zapier"
const kafka=new Kafka({
    clientId:'producer-2',
    brokers:['localhost:9092']
})
async function  main() {
    const consumer=kafka.consumer({groupId:'main-worker-2'});
    await consumer.connect();
    const producer=kafka.producer();
    await producer.connect();
    await consumer.subscribe({topic:TOPIC_NAME,fromBeginning:false})
    await consumer.run({
        autoCommit:false,
       eachMessage:async({topic,partition,message})=>{
              console.log({topic,partition,
              offset:message.offset,
              value:message.value?.toString()})
              if(!message.value?.toString()){
              console.log("no value found");
                return;
              }
              const parsedmessge=JSON.parse(message.value?.toString());
              const zaprunid=parsedmessge.zaprunid;
              console.log(zaprunid,zaprunid);
              const stage=parsedmessge.stage;
              const zaprundetails=await prisma.zaprun.findFirst({
                where:{
                    id:zaprunid
                },
                include:{
                    zap:{
                        include:{
                            Action:{
                                include:{
                                    actiontype:true
                                }
                            }
                        }
                    }
                }
              })
              console.log(zaprundetails);
              if(!zaprundetails){
                console.log("No zapdetail found");
              }
              const currentaction=zaprundetails?.zap.Action.find(x=>x.SortingOrder===stage)
              if(!currentaction){
                return;
              }
            //    // You received {comment.amount} momey from {comment.link}
//    parse(my name is {comment.name} my address is comment.addrss)",{
// comment:{
// name:"youval",
// address:123232321
// }"
              const zaprunmetadata=zaprundetails?.metadata;
              console.log(currentaction.actiontype.id.toString());
              // console.log(currentaction.actiontype);
              if((currentaction.actiontype.id).toString()==="email"){
                console.log("You are at email section")
             const body = parse((currentaction.metaData as JsonObject)?.body as string, zaprunmetadata);
              const to=parse((currentaction.metaData as JsonObject)?.email as string,zaprunmetadata) ;
            // @ts-ignore
            console.log("You are at email section")
              await sendEmail(to,body);
              }
              if(currentaction.actiontype.id==="send-sol"){
                const amount=parse((currentaction.metaData as JsonObject)?.amount as string,zaprunmetadata );
                const address=parse((currentaction.metaData as JsonObject)?.to as string,zaprunmetadata);
            // @ts-ignore
            console.log("You are at solana section");    
            await sendSol(address,amount);
              }
              await new Promise(r=>setTimeout(r,500));
           console.log("last stage");
              const laststage=(zaprundetails?.zap.Action?.length||1)-1;
              if(laststage!==stage){
                console.log("check");
                await producer.send({
                    topic:TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                          stage: stage + 1,
                          zaprunid
                        })
                      }]
                })
              }
              console.log("'commiit");
              await consumer.commitOffsets([{
                topic:TOPIC_NAME,
                partition:partition,
                offset:(parseInt(message.offset)+1).toString()
              }])
              console.log("final lasst");
            //   await producer.send({
            //     topic,
            //     messages:pendingrows.map(row=>{
            //         return{
            //             value:JSON.stringify({zaprunid:row.zaprunid,stage:0})
            //         }
            //     })
            // })
       }

    })
}
main();

