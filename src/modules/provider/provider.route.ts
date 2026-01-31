import { Router } from "express";
import { authHandler } from "../../middleware/authHandler";
import { ROLE } from "../../../generated/prisma/enums";
import { providerController } from "./provider.controller";

const route=Router();

route.put('/profile',authHandler(ROLE.admin,ROLE.provider,ROLE.customer),providerController.updateOrCreateProvider)
route.get('/:id',providerController.getProviderProfile)

export const providerRoute=route;