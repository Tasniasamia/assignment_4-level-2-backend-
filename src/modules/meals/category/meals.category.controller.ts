import type { NextFunction, Request, Response } from "express";
import type { addCategory } from "./meals.category.interface"
import { mealsCategoryService } from "./meals.category.service"

const addCategory=async(req:Request,res:Response,next:NextFunction)=>{
try{
const data=await req.body as addCategory
const result=await mealsCategoryService.addCategory(data);
if(result?.success){
    return res.status(201).json(result)

}
next(result);
}
catch(error:any){
    next(error)
}
}


export const mealsCategoryController={
    addCategory
}