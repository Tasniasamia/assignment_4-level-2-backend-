import { Router } from "express";
import { authController } from "./auth.controller";

const route=Router();
route.post('/resister',authController.resister);
route.post('/login',authController.login);
route.get('/me',authController.session)

export const authRoute=route;