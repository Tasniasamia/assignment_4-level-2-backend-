import { ORDERSTATUS } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type {
  reviewType,
  reviewUpdateType,
  reviewUser,
} from "./review.interface";

const addReview = async (user: reviewUser, payload: reviewType) => {
  const findOrder = await prisma.order.findFirst({
    where: {
      id: payload?.orderId,
      customerId: user?.id,
      status: ORDERSTATUS.DELIVERED,
    },
  });
  if (!findOrder) {
    return { success: false, message: "Order not found to review", data: null };
  }

  const alreadyReviewed = await prisma.cartItem.findFirst({
    where: {
      orderId: payload?.orderId,
      mealId: payload?.mealId,
      isReviewed: true,
      userId: payload?.userId,
    },
  });
  if (alreadyReviewed) {
    return {
      success: false,
      data: null,
      message: "Already reviewed",
    };
  }
  const findMeal = await prisma.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED },
    include: { items: { where: { mealId: payload.mealId } } },
  });

  if (!findMeal) {
    return { success: false, message: "Meal not found to review", data: null };
  }
  console.log('review payload',payload);
  const addReviewData = await prisma.review.create({ data: {userId:payload?.userId,mealId:payload?.mealId,rating:payload?.rating as number,comment:payload?.comment as string} });
  console.log("addReviewData",addReviewData);
  if (addReviewData) {
    const result = await prisma.review.aggregate({
      where: { mealId: payload?.mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const avgRating = result._avg.rating ?? 0;
    const displayRating = Number(avgRating.toFixed(1));
    if (displayRating) {
      const updateRating = await prisma.meal.update({
        where: { id: payload.mealId },
        data: { rating: displayRating },
      });
      if (updateRating) {
     const findCart=   await prisma.cartItem.findFirst({where:{orderId:payload?.mealId,mealId:payload?.mealId}})
        if(findCart){
          await prisma.cartItem.update({
            where:{id:findCart?.id},
            data:{isReviewed:true}
          })
        }
     return {
          success: true,
          messages: "add reviewed successfully",
          data: addReviewData,
        };
      }
    }
  }
  
  return {
    success: false,
    message: "Failed to add review",
    data: null,
  };
};
const editReview = async (
  id: string,
  user: reviewUser,
  payload: reviewUpdateType
) => {
  const findOrder = await prisma.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED },
  });
  if (!findOrder) {
    return { success: false, message: "Order not found to review", data: null };
  }
  const findMeal = await prisma.order.findFirst({
    where: { customerId: user?.id, status: ORDERSTATUS.DELIVERED },
    include: { items: { where: { mealId: payload.mealId } } },
  });
  if (!findMeal) {
    return { success: false, message: "Meal not found to review", data: null };
  }
  const addReviewData = await prisma.review.update({
    where: { id: id },
    data: payload,
  });
  if (addReviewData) {
    const result = await prisma.review.aggregate({
      where: { mealId: payload?.mealId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avgRating = result._avg.rating ?? 0;
    const displayRating = Number(avgRating.toFixed(1));
    if (displayRating) {
      const updateRating = await prisma.meal.update({
        where: { id: payload.mealId },
        data: { rating: displayRating },
      });
      if (updateRating) {
        return {
          success: true,
          messages: "add reviewed successfully",
          data: addReviewData,
        };
      }
    }
  }
  return {
    success: false,
    message: "Failed to add review",
    data: null,
  };
};
const getAllReview = async (mealId: string) => {
  const findAllReview = await prisma.review.findMany({
    where: { mealId: mealId },
  });

  return { success: true, data: findAllReview };
};
const deleteReview = async (id: string, user: reviewUser) => {
  const findReview = await prisma.review.findFirst({
    where: { id: id, userId: user?.id },
  });
  if (findReview) {
    const deleteReview = await prisma.review.delete({ where: { id: id } });
    if (deleteReview) {
      return {
        success: true,
        message: "Review deleted successfully",
        data: deleteReview,
      };
    }
  }
  return {
    success: false,
    message: "Failed to delete review",
    data: null,
  };
};
export const reviewService = {
  addReview,
  editReview,
  getAllReview,
  deleteReview,
};
