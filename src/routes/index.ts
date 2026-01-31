import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { providerRoute } from "../modules/provider/provider.route";
import { userRoute } from "../modules/user/user.route";


const route=Router();

const allRoutes=[
    {
        path:'/auth',
        handler:authRoute
    },
    {
        path:'/providers',
        handler:providerRoute
    },
    {
        path:'/user',
        handler:userRoute
    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;