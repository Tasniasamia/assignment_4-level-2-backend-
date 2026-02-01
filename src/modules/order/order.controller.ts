import type { NextFunction, Request, Response } from "express";
import { ROLE } from "../../../generated/prisma/enums";
import { orderService } from "./order.service";
import type { CreateOrderPayload } from "./order.interface";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
    return  next({
        success: false,
        message: "Only customer can placed order",
        data: null,
      });
    }
    const data = (await req.body) as CreateOrderPayload;
    const result = await orderService.createOrder(data);
    if (result?.success) {
        return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req?.user?.role) {
   return   next({
        success: false,
        message: "Unauthorized User",
        data: null,
      });
    }
    const result = await orderService.getOrder(
      req?.user as {
        id: string;
        name: string;
        email: string;
        role: string | undefined;
        emailVerified: boolean;
      }
    );
    if (result?.success) {
        return res.status(201).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};

export const orderController = { createOrder, getOrder };
