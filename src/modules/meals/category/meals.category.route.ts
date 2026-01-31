import { Router } from "express";
import { authHandler } from "../../../middleware/authHandler";
import { ROLE } from "../../../../generated/prisma/enums";
import { mealsCategoryController } from "./meals.category.controller";

const route=Router();
route.post('/',authHandler(ROLE.admin),mealsCategoryController.addCategory);


export const mealsCategoryRoute=route;