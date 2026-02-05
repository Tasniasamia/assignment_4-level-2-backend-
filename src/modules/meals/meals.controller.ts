import type { NextFunction, Request, Response } from "express";
import type { MealType } from "./meals.interface";
import { mealsService } from "./meals.service";
import paginationSortingHelper from "../../helpers/paginationHelper";
import { ROLE } from "../../../generated/prisma/enums";

const addMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== ROLE.provider) {
        return res.status(400).json({
          success: false,
          messsage: "Only provider can add the meal",
          data: null,
        });
      }
    const data = await req.body;
    const result = await mealsService.addMeal(data as MealType);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};
const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== ROLE.provider) {
        return res.status(400).json({
          success: false,
          messsage: "Only provider can update the meal",
          data: null,
        });
      }
    const { id } = await req.params;
    const data = await req.body;
    const result = await mealsService.updateMeal(id as string, data);

    if (result?.success) {
      return res.status(201).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};
const deleteMeal = async (req: Request, res: Response, next: NextFunction)=> {
   try{
    if (req.user?.role !== ROLE.provider) {
        return res.status(400).json({
          success: false,
          messsage: "Only provider can delete the meal",
          data: null,
        });
      }
    const { id } = await req.params;
    const result=await mealsService.deleteMeal(id as string)
  if (result?.success) {
   return res.status(201).json(result);
  }
 next(result)

} catch (error) {
    next(error);
  }
};

const getAllMeal = async (req: Request, res: Response, next: NextFunction) => {
   try{
    const { categoryId, dietaryPreferences, price } = req?.query;
    //type defined
    const category = typeof categoryId === "string" ? categoryId : undefined;
    const dietaryPreference = dietaryPreferences as string|undefined
    const priceNumber=Number(price)
  
  

  
    const {page,limit,skip}= paginationSortingHelper(req.query);
   const result = await mealsService.getAllMeal(
     category,dietaryPreference,priceNumber,page,limit,skip
    );
   if(result?.success){
    return res.status(200).json(result);
   }
next(result);


} catch (error) {
    next(error);
  }
};

const getAllMealProvider=async(req: Request, res: Response, next: NextFunction)=>{
    try{
        if(req?.user?.role !== ROLE.provider){
          return next({
            success:false,
            message:"Only provider is acceptable",
            data:null
          })
        }
        const userdata=await req?.user as {   
            id:string,
          name: string,
          email: string,
          role:string|undefined,
          emailVerified:boolean}
        const { categoryId, dietaryPreferences, price } = req?.query;
        const category = typeof categoryId === "string" ? categoryId : "all";
        const dietaryPreference = dietaryPreferences as string|undefined
        const priceNumber=Number(price)
        const {page,limit,skip}= paginationSortingHelper(req.query);
       const result = await mealsService.getAllMealProvider(
         category,dietaryPreference,priceNumber,page,limit,skip,userdata
        );
       if(result?.success){
        return res.status(200).json(result);
       }
    next(result);
    }
    catch(error){
        next(error)
    }
}

const getMealById=async(req: Request, res: Response, next: NextFunction)=>{
    try{
     const{id}=req?.params;
     const result=await mealsService.getMealById(id as string);
     if(result?.success){
        return res.status(200).json(result);
     }
     next(result);
    }
    catch(error){
        next(error)
    }
}


export const mealController = {
  addMeal,
  updateMeal,
  deleteMeal,
  getAllMeal,
  getAllMealProvider,
  getMealById
};
