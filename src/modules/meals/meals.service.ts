import type { MealWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { MealType } from "./meals.interface";

const addMeal = async (data: MealType) => {
  const insertdata = await prisma.meal.create({ data });
  console.log("insertData ", insertdata);
  if (insertdata?.id) {
    return {
      success: true,
      message: "Meat added Successfully",
      data: insertdata,
    };
  }
  return {
    success: false,
    message: "Failed to add meal",
    data: insertdata,
  };
};
const updateMeal = async (id: string, data: MealType) => {
  const findCategory = await prisma.meal.findUnique({ where: { id: id } });
  if (findCategory) {
    const updateData = await prisma.meal.update({
      where: { id: id },
      data: { ...data },
    });
    return {
      success: true,
      message: "Meal updated successfully",
      data: updateData,
    };
  }
  return {
    success: false,
    message: "Failed to update meal",
    data: null,
  };
};
const deleteMeal = async (id: string) => {
  const findCategory = await prisma.meal.findUnique({ where: { id: id } });
  if (findCategory) {
    const deleteData = await prisma.meal.delete({ where: { id: id } });
    return {
      success: true,
      message: "Meal deleted successfully",
      data: deleteData,
    };
  }
  return {
    success: false,
    message: "Failed to delete meal",
    data: null,
  };
};
const getAllMeal = async (
  category: string | undefined,
  dietaryPreference: string | undefined,
  priceNumber: number | undefined,
  page: number,
  limit: number,
  skip: number
) => {
  const anyConditions: MealWhereInput[] = [];
  if (category || dietaryPreference) {
    anyConditions.push({
      OR: [
        {
          categoryId: {
            contains: category as string,
            mode: "insensitive",
          },
        },
        {
          dietaryPreferences: {
            contains: dietaryPreference as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (priceNumber) {
    anyConditions.push({ price: priceNumber });
  }
  anyConditions.push({ isAvailable: true });
  const data = await prisma.meal.findMany({
    skip: skip,
    take: limit,
    where: { AND: anyConditions },
    include: {
      provider: {
        include: {
          ProviderProfiles: true,
        },
      },
      category: true,
      reviews: true,
    },
  });

  const total = await prisma.meal.count({
    where: { AND: anyConditions },
  });
  return {
    success: true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: data,
  };
};

const getAllMealProvider = async (
  category: string | undefined,
  dietaryPreference: string | undefined,
  priceNumber: number | undefined,
  page: number,
  limit: number,
  skip: number,
  user: {
    id: string;
    name: string;
    email: string;
    role: string | undefined;
    emailVerified: boolean;
  }
) => {
  const anyConditions: MealWhereInput[] = [];
  anyConditions.push({providerId:user?.id});
  if (category!='all' || dietaryPreference) {
    anyConditions.push({
      OR: [
        {
          categoryId: {
            contains: category as string,
            mode: "insensitive",
          },
        },
        {
          dietaryPreferences: {
            contains: dietaryPreference as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (priceNumber) {
    anyConditions.push({ price: priceNumber });
  }
  const data = await prisma.meal.findMany({
    skip: skip,
    take: limit,
    where: { AND: anyConditions },
    include: {
      provider: {
        include: {
          ProviderProfiles: true,
        },
      },
      category: true,
      reviews: true,
    },
  });

  const total = await prisma.meal.count({
    where: { AND: anyConditions },
  });
  return {
    success: true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: data,
  };
};

const getMealById = async (id: string) => {
  const data = await prisma.meal.findUnique({
    where: { id: id },
    include: {
      provider: {
        include: {
          ProviderProfiles: true,
        },
      },
      category: true,
      reviews: {include:{user:true}},
    },
  });
  if (data?.id) {
    return { success: true, data: data };
  }
  return { success: false, data: null };
};
export const mealsService = {
  addMeal,
  updateMeal,
  deleteMeal,
  getAllMeal,
  getAllMealProvider,
  getMealById,
};
