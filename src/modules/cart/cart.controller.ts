import type { NextFunction, Request, Response } from "express";
import type { TCart } from "./cart.interface";
import { cartService } from "./cart.service";
import { ROLE } from "../../../generated/prisma/enums";

const addCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
    return  next({
        success: false,
        message: "Only customer can add item into cart",
        data: null,
      });
    }
    const data = (await req.body) as TCart;
    const result = await cartService.addCart(data);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};
const editCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
    return  next({
        success: false,
        message: "Only customer can edit item into cart",
        data: null,
      });
    }
    const data = (await req.body) as TCart;
    const { id } = await req.params;
    const result = await cartService.editCart(id as string, data);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};

const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
    return  next({
        success: false,
        message: "Only customer can delete cart item",
        data: null,
      });
    }
    const { id } = await req.params;
    const result = await cartService.deleteCart(id as string);
    if (result?.success) {
      return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req?.user?.role !== ROLE.customer) {
     return next({
        success: false,
        message: "You have to be a customer",
        data: null,
      });
    }
    const result = await cartService.getCart(req?.user?.id as string);

    if (result?.success) {
     return res.status(200).json(result);
    }
    return next(result);
  } catch (error) {
    return next(error);
  }
};

export const cartController = { addCart, editCart, deleteCart, getCart };
