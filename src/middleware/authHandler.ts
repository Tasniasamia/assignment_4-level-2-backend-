import type { NextFunction, Request, Response } from "express"
import type { ROLE } from "../../generated/prisma/enums"
import { auth } from "../lib/auth";

export const authHandler=(...roles:ROLE[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const session=await auth.api.getSession({headers:req?.headers as any});
        if(!session){
           return res.status(401).json(
               {
                   success:false,
                   message:"You are not authorized"
   
               }
           )
        }
   
   
        if(!session?.user?.emailVerified){
           res.status(403).json({
               success:false,
               message:"Email Verification Required. Please verify your email"
           })
        }
       console.log("roles.includes(req?.user?.role as ROLE)",!roles.includes(req?.user?.role as ROLE))
        if(!roles?.length && !roles.includes(req?.user?.role as ROLE)){
        res.status(403).json({
           success:false,
           message:"Forbidden: You don't have permission to access this resources"
        })
        }
        req.user={
           id:session?.user?.id,
           email:session?.user?.email,
           name:session?.user?.name,
           role:session?.user.role,
           emailVerified:session?.user?.emailVerified
        }
   
       
        next(); 
    }
}