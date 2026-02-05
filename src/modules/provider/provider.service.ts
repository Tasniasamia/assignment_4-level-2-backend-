import { ORDERSTATUS } from "../../../generated/prisma/enums";
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
const providerDashboard=async(id:string)=>{
    const totalOrders = await prisma.order.aggregate({
        where: {
          items: {
            some: {
              meal: {
                providerId: id, // 👈 provider id
              },
            },
          },
        },
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      });
      
    
      // 🔹 Delivered Orders
      const deliveredOrders = await prisma.order.aggregate({
        where: {
            
            items: {
              some: {
                meal: {
                  providerId: id, // 👈 provider id
                },
              },
            },
            status:ORDERSTATUS.DELIVERED
          },
        _count: {
          id: true,
        },
        _sum: {
          totalAmount: true,
        },
      });
    
      return {
        success: true,
        data: {
          totalOrderCount: totalOrders._count.id,
          totalOrderAmount: totalOrders._sum.totalAmount ?? 0,
    
          deliveredOrderCount: deliveredOrders._count.id,
          deliveredOrderAmount: deliveredOrders._sum.totalAmount ?? 0,
        },
      };
}


export const providerService={
    updateOrCreateProvider,
    getProviderProfile,
    providerDashboard
}