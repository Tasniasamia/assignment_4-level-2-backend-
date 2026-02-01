import { Router } from "express";
import { authRoute } from "../modules/auth/auth.route";
import { providerRoute } from "../modules/provider/provider.route";
import { userRoute } from "../modules/user/user.route";
import { mealsCategoryRoute } from "../modules/meals/category/meals.category.route";
import { mealRoute } from "../modules/meals/meals.route";
import { cartRoute } from "../modules/cart/cart.route";
import { orderRoute } from "../modules/order/order.route";


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
    },
    {
        path:'/meals/category',
        handler:mealsCategoryRoute
    },
    {
        path:'/meals',
        handler:mealRoute
    },
    {
        path:"/cart",
        handler:cartRoute
    },
    {
        path:'/order',
        handler:orderRoute
    }
]
allRoutes.forEach((i)=>route.use(i?.path,i?.handler))
export default route;