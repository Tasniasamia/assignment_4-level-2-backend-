import { Router } from "express";
import { ROLE } from "../../../generated/prisma/enums";
import { authHandler } from "../../middleware/authHandler";
import { reviewController } from "./review.controller";


const route=Router();
route.post('/',authHandler(ROLE.customer),reviewController.addReview);
route.put('/:id',authHandler(ROLE.customer),reviewController.editReview);
route.get('/:mealId',reviewController.getReview);
route.delete('/:id',authHandler(ROLE.customer),reviewController.deleteReview)

export const reviewRoute=route;