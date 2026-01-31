import type { NextFunction, Request, Response } from "express"
import { providerService } from "./provider.service";
import { ROLE } from "../../../generated/prisma/enums";

const updateOrCreateProvider=async(req:Request,res:Response,next:NextFunction)=>{

try{
  const userdata=await req.user;
  if(userdata?.role !== ROLE.provider){
    return res.status(400).json( {
        success:false,
        message:`Only ${userdata?.role} is acceptable`,
        data:userdata
    })
  }
  const data=await req.body;
  const result=await providerService.updateOrCreateProvider({userId:userdata?.id,...data});
  
  if (result?.success) {
    return res.status(200).json(result);
  }

  next(result);
}
catch(error:any){
    next(error)
}
}
const getProviderProfile=async(req:Request,res:Response,next:NextFunction)=>{
    try{
     const {id}=await req.params;
     console.log("id",id);
     const result=await providerService.getProviderProfile(id as string);
     if(result?.success){
        return res.status(200).json(result);
     }
     next(result)
    }
    catch(error:any){
     next(error);
    }
}
export const providerController={
    updateOrCreateProvider,
    getProviderProfile
}