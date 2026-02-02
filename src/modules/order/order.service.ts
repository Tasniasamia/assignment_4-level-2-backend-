import { ORDERSTATUS, ROLE } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { CreateOrderPayload } from "./order.interface";



 const createOrder = async ({
  userId,
  deliveryAddress,
}: CreateOrderPayload) => {
  return await prisma.$transaction(async (tx) => {
  
  const cartItems = await tx.cartItem.findMany({
      where: {
        userId,
        orderId: null,
      },
      include: {
        meal: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.meal.price * item.quantity;
    }, 0);

    const order = await tx.order.create({
      data: {
        customerId: userId,
        deliveryAddress,
        totalAmount,
        status: ORDERSTATUS.PLACED,
      },
    });

    await tx.cartItem.updateMany({
      where: {
        userId,
        orderId: null,
      },
      data: {
        orderId: order.id,
      },
    });
    if(order){
        return {
            success:true,
            data:order,
            message:"Order has been placed"
        };
    }
    return{
        success:null,
        data:null,
        message:"Order placed failed"
    }
  
  });
};



const getOrder=async(user:{  id:string,
    name: string,
    email: string,
    role:string|undefined,
    emailVerified:boolean})=>{

        let findData;
        if(user?.role === ROLE.customer){
            findData=await prisma.order.findMany({
                where:{customerId:user?.id},
                include:{items:{include:{meal:{include:{provider:{include:{ProviderProfiles:true}}}}}}}
            })
        }
        else if (user?.role === ROLE.provider) {
          findData = await prisma.order.findMany({
            where: {
              items: {
                some: {
                  meal: {
                    providerId: user.id
                  }
                }
              }
            },
            include: {
              items: {
                where: {
                  meal: {
                    providerId: user.id
                  }
                },
                include: {
                  meal: {
                    include: {
                      provider: {
                        include: {
                          ProviderProfiles: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
        }
        else if(user?.role === ROLE.admin){
            findData=await prisma.order.findMany({
                include:{items:{
                    include:{
                        meal:{
                         include:{provider:{include:{ProviderProfiles:true}}}
                        }
                    }
                }}
            })
        }

        if(findData){
            return {
                success:true,
                data:findData
            }
        }

return {
    success:false,
    data:null
}

}

export const orderService={createOrder,getOrder}