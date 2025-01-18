import jwt from "jsonwebtoken"
import {Request,Response,NextFunction} from "express"
const string=process.env.JWT_SECRET
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
    
   try {
    if(!req.headers.authorization) {
        throw new Error("Authantication error");
    }
    const token=req.headers.authorization.split(" ")[1];
    
    
    if(!token){
        throw new Error("Authoriazation error");
    }
    const decode= jwt.verify(token,string as string);
    // @ts-ignore
    req.id=decode.id;
    next();
   } catch (error) {
    console.log(error);
    res.status(402).json({error});
   }
}