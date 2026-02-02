import type { NextFunction, Request, Response } from "express"
import { reviewService } from "./review.service"
import type { reviewType, reviewUpdateType, reviewUser } from "./review.interface"

const addReview=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const payloadData=await req.body;
        const result=await reviewService.addReview(req?.user as reviewUser,payloadData as reviewType)
        if(result?.success){
        return res.status(201).json(result);
        }
        return next(result);
    }
    catch(error){
       return next(error);
    }
}
const editReview=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {id}=await req.params;
        const payload=await req.body;
        const result=await reviewService.editReview((id as string),req?.user as reviewUser,(payload as reviewUpdateType))
        if(result?.success){
        return res.status(201).json(result);
        }
        return next(result);
    }
    catch(error){
       return next(error);
    }
}
const getReview=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {mealId}=await req.params;
        const result=await reviewService.getAllReview(mealId as string)
        if(result?.success){
        return res.status(200).json(result);
        }
        return next(result);
    }
    catch(error){
       return next(error);
    }
}

const deleteReview=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {id}=await req.params;
        const result=await reviewService.deleteReview(id as string,(req.user as reviewUser))
        if(result?.success){
        return res.status(200).json(result);
        }
        return next(result);
    }
    catch(error){
       return next(error);
    } 
}

export const reviewController={
    addReview,editReview,getReview,deleteReview
}