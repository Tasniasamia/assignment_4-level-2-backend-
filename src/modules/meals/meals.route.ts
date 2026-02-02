import { Router } from "express";
import { authHandler } from "../../middleware/authHandler";
import { ROLE } from "../../../generated/prisma/enums";
import { mealController } from "./meals.controller";


const route=Router();
route.post('/',authHandler(ROLE.provider),mealController.addMeal);
route.put('/:id',authHandler(ROLE.provider),mealController.updateMeal);
route.delete('/:id',authHandler(ROLE.provider),mealController.deleteMeal);
route.get('/',mealController.getAllMeal);
route.get('/provider',authHandler(ROLE.provider),mealController.getAllMealProvider);
route.get('/:id',mealController.getMealById);


export const mealRoute=route;