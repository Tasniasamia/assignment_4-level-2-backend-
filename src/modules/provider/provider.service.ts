import { prisma } from "../../lib/prisma"
import type { providerProfileType } from "./provider.interface";

const updateOrCreateProvider=async(payload:providerProfileType)=>{
   const updateData = await prisma.providerProfiles.upsert({
        where: { userId: payload.userId },
        update: {
          restaurantName: payload.restaurantName,
          description: payload.description ?? null,
          phone: payload.phone,
          address: payload.address,
          openingTime: payload.openingTime,
          closingTime: payload.closingTime,
          isOpen: payload.isOpen,
        },
        create: {
          userId: payload.userId,
          restaurantName: payload.restaurantName,
          description: payload.description ?? null,
          phone: payload.phone,
          address: payload.address,
          openingTime: payload.openingTime,
          closingTime: payload.closingTime,
          isOpen: payload.isOpen,
        },
      });
      
 if(updateData){
    return {
        success:true,
        data:updateData,
        message:'Provider profile updated or Created Successfully'
    }
 }
 return {
    success:false,
    message:'Provider profile update or Create failed',
    data:null

 }
}
const getProviderProfile=async(id:string)=>{
const data=await prisma.providerProfiles.findUnique({
    where:{userId:id}
})
if(data){
    return {
        success:true,
        data:{...data},
        
    }
}
return {
    success:false,
    message:'provider not found'
}
}
export const providerService={
    updateOrCreateProvider,
    getProviderProfile
}