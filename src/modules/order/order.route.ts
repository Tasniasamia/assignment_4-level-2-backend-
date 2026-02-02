import { Router } from "express";
import { ROLE } from "../../../generated/prisma/enums";
import { orderController } from "./order.controller";
import { authHandler } from "../../middleware/authHandler";

const route=Router();
route.post('/',authHandler(ROLE.customer),orderController.createOrder);
route.get('/',authHandler(ROLE.admin,ROLE.customer,ROLE.provider),orderController.getOrder);
route.put('/:id',authHandler(ROLE.customer,ROLE.provider),orderController.updateOrder);
route.get('/:id',authHandler(ROLE.admin,ROLE.customer,ROLE.provider),orderController.getSingleOrder);
route.delete('/:id',authHandler(ROLE.admin,ROLE.customer,ROLE.provider),orderController.deleteOrder);
export const orderRoute=route;