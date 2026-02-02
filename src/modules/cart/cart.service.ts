import { prisma } from "../../lib/prisma";
import type { TCart } from "./cart.interface";

const addCart = async (data: TCart) => {
  const addCartItem = await prisma.cartItem.create({ data });
  if (addCartItem?.id) {
    return {
      success: true,
      data: addCartItem,
      message: "Item added into cart successfully",
    };
  }
  return {
    success: false,
    data: addCartItem,
    message: "Failed to add item into cart",
  };
};
const editCart = async (CartId: string, data: TCart) => {
  const existItemIntoCart = await prisma.cartItem.findUnique({
    where: { id: CartId },
  });
  if (existItemIntoCart?.id) {
    const newQuantity = existItemIntoCart.quantity + data?.quantity;
    const { quantity, ...rest } = existItemIntoCart;
    const updateCart = await prisma.cartItem.update({
      where: { id: CartId ,orderId:null},
      data: { quantity: newQuantity, ...rest },
    });
    if (updateCart?.id) {
      return {
        success: true,
        message: "Cart Data Updated Successfully",
        data: updateCart,
      };
    }
  }
  return {
    success: false,
    message: "Cart data update failed",
    data: null,
  };
};
const deleteCart=async(cartId:string)=>{
    const deleteCart=await prisma.cartItem.delete({
        where:{id:cartId},
    });
    if(deleteCart?.id){
        return {
            success:true,
            message:"Cart deleted successfully",
            data:deleteCart
        }
    }
    return {
        success:false,
        message:"Cart deleted failed",
        data:deleteCart
    }
}
const getCart=async(userId:string)=>{
    const getCartData=await prisma.cartItem.findMany({where:{userId:userId,orderId: null},include:{user:true,meal:true}})
    return {
        success:true,
        data:getCartData
    }
}
export const cartService = { addCart, editCart,deleteCart,getCart };
