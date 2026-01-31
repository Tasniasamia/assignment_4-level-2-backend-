import { Router } from "express";
import { authController } from "./auth.controller";
import { authHandler } from "../../middleware/authHandler";
import { ROLE } from "../../../generated/prisma/enums";

const route=Router();
route.post('/resister',authController.resister);
route.post('/login',authController.login);
route.get('/me',authHandler(ROLE.admin,ROLE.provider,ROLE.customer),authController.getProfile)
route.put('/profile',authHandler(ROLE.admin,ROLE.provider,ROLE.customer),authController.updateProfile)

export const authRoute=route;