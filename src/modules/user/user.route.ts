import { Router } from "express";

import { ROLE } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";
import { authHandler } from "../../middleware/authHandler";

const route=Router();
route.get('/admin',authHandler(ROLE.admin),userController.getAllUser);

export const userRoute=route;