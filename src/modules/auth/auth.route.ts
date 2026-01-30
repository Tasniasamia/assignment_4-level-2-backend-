import { Router } from "express";
import { authController } from "./auth.controller";

const route=Router();
route.post('/resister',authController.resister);

export const authRoute=route;