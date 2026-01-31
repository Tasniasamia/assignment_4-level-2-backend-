import type { NextFunction, Request, Response } from "express";
import type { addCategory } from "./meals.category.interface";
import { mealsCategoryService } from "./meals.category.service";
import { ROLE } from "../../../../generated/prisma/enums";

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can add the category",
        data: null,
      });
    }
    const data = (await req.body) as addCategory;
    const result = await mealsCategoryService.addCategory(data);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error: any) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can update the category",
        data: null,
      });
    }
    const { id } = await req.params;
    const payload = await req.body;
    const result = await mealsCategoryService.updateCategory(
      id as string,
      payload
    );
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can delete the category",
        data: null,
      });
    }
    const { id } = await req.params;
    const result = await mealsCategoryService.deleteCategory(id as string);
    if (result?.success) {
      return res.status(201).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await mealsCategoryService.getAllCategory();
    if (result?.success) {
      return res.status(200).json(result);
    }
    next(result);
  } catch (error) {
    next(error);
  }
};

export const mealsCategoryController = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
};
