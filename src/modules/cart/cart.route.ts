import { Router } from "express";
import { authHandler } from "../../middleware/authHandler";
import { ROLE } from "../../../generated/prisma/enums";
import { cartController } from "./cart.controller";

const route=Router();
route.post('/',authHandler(ROLE.customer),cartController.addCart);
route.put('/:id',authHandler(ROLE.customer),cartController.editCart);
route.delete('/:id',authHandler(ROLE.customer),cartController.deleteCart);
route.get('/',authHandler(ROLE.customer),cartController.getCart);
export const cartRoute=route;