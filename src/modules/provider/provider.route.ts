import { Router } from "express";
import { authHandler } from "../../middleware/authHandler";
import { ROLE } from "../../../generated/prisma/enums";
import { providerController } from "./provider.controller";

const route=Router();
route.get('/dashboard',authHandler(ROLE.provider),providerController.providerDashboard);

route.put('/profile',authHandler(ROLE.provider),providerController.updateOrCreateProvider)
route.get('/:id',providerController.getProviderProfile);


export const providerRoute=route;