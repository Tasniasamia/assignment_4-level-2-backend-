import type { NextFunction, Request, Response } from "express"
import { authService } from "./auth.service"
import type { resisterData } from "./auth.interface";
type resultType={
    success: boolean;
    data: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
    };
    messsage: string;
    message?: never;
} | {
    success: boolean;
    message: string;
    data: {
        token: null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    } | {
        token: string;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    };
    messsage?: never;
}
const resister=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const payload=await (req.body as resisterData)
       const result:resultType=await authService.resister(payload);
       console.log("result",result);
       if(result?.success){
        res.status(201).json(result);
       }
      next(result);
    }
    catch(error:any){
next(error);
    }
}

export const authController={
    resister
}