import type { NextFunction, Request, Response } from "express";
import { ORDERSTATUS, ROLE } from "../../../generated/prisma/enums";
import { orderService } from "./order.service";
import type { CreateOrderPayload } from "./order.interface";
import paginationSortingHelper from "../../helpers/paginationHelper";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
    return  next({
        success: false,
        message: "Only customer can placed order",
        data: null,
      });
    }
    const data = (await req.body) as CreateOrderPayload;
    const result = await orderService.createOrder(data);
    if (result?.success) {
        return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req?.user?.role) {
   return   next({
        success: false,
        message: "Unauthorized User",
        data: null,
      });
    }
    const { page,limit,skip,sortBy,sortOrder}=  paginationSortingHelper(req.query);

    const result = await orderService.getOrder(
      page,limit,skip,sortBy,sortOrder,
      (req?.user as {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        emailVerified: boolean;
      })
    );
    


    if (result?.success) {
        return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};

const updateOrder=async(req: Request, res: Response, next: NextFunction) =>{
try{
const {id}=await req?.params;
const data=await req?.body;
console.log("data",data)
const result=await orderService.updateOrder(id as string,req?.user as {
  id: string;
  name: string;
  email: string;
  role: string | undefined;
  emailVerified: boolean;
},data);

if(result?.success){
  return res.status(201).json(result);
}
return next(result);
}
catch(error){
 return next(error)
}
}

const getSingleOrder=async(req:Request,res:Response,next:NextFunction)=>{
try{
 const {id}=await req?.params;
 const result=await orderService.getSingleOrder(id as string);
if(result?.success){
  return res.status(200).json(result)
}
return next(result);
}
catch(error){
 return next(error)
}
}

const deleteOrder=async(req:Request,res:Response,next:NextFunction)=>{
try{
  const {id}=await req.params;
 const result=await orderService.deleteOrder(id as string);
 if(result?.success){
  return res.status(201).json(result)
 }
 next(result);
}
catch(error){
  return next(error)
}
}

export const orderController = { createOrder, getOrder, updateOrder,getSingleOrder,deleteOrder};
