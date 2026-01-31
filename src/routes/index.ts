import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { providerRoute } from "../modules/provider/provider.route";


const route=Router();

const allRoutes=[
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/providers',
        handler:providerRoute

    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;