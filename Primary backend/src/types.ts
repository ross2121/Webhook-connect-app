import {z} from "zod";
export const UserRegister=z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6).max(8)
}) 
export const usersingin=z.object({
email:z.string(),
password:z.string().min(6).max(8)
})
export const  zap=z.object({
    availableTriggerid:z.string(),
    metadata:z.any().optional(),
    action:z.array(z.object({
        availabaction:z.string(),
        metadata:z.any().optional()
    
    }))
})

