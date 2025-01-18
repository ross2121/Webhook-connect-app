import nodemailer from "nodemailer";
export const transportmail=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.password
    },
    port:465,
    secure:false,
    host:'smtp.gmail.com'
})
export async function sendEmail(to: string, body: string) {
    await transportmail.sendMail({
        from: "youvalsingh40@gmail.com",
        sender: "youvalsingh40@gmail.com",
        to,
        subject: "Hello from Zapier",
        text: body
    })
}
