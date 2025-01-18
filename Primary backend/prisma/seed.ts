import { PrismaClient } from "@prisma/client";
const prismaClient=new PrismaClient();
async function main() {
    await prismaClient.trigeredavailable.create({
        data:{
            id:"webhook",
            "name":"Webhook",
            "image":"https://i.sstatic.net/S3SNU.jpgs",
        }
    })
await prismaClient.actionavailable.create({
    data:{
        id:"send-sol",
        name:"Send solana",
        image:"https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
    }
})
await prismaClient.actionavailable.create({
    data:{
        id:"email",
        "name":"E-mail",
        "image":"https://www.pcworld.com/wp-content/uploads/2023/04/gmail_logo-100758589-orig.jpg?quality=50&strip=all"
    }
})
}
main();