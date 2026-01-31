import { Router } from "express";
import { authHandler } from "../../../middleware/authHandler";
import { ROLE } from "../../../../generated/prisma/enums";
import { mealsCategoryController } from "./meals.category.controller";

const route=Router();
route.post('/',authHandler(ROLE.admin),mealsCategoryController.addCategory);
route.put('/:id',authHandler(ROLE.admin),mealsCategoryController.updateCategory);
route.delete('/:id',authHandler(ROLE.admin),mealsCategoryController.deleteCategory);
route.get('/',mealsCategoryController.getAllCategory);


export const mealsCategoryRoute=route;