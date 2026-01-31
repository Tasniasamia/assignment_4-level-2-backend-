import { Router } from "express";

import { ROLE } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";
import { authHandler } from "../../middleware/authHandler";

const route=Router();
route.get('/admin',authHandler(ROLE.admin),userController.getAllUser);
route.put('/update-status',authHandler(ROLE.admin),userController.updateStatus);

export const userRoute=route;