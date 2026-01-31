import type { NextFunction, Request, Response } from "express";
import paginationSortingHelper from "../../helpers/paginationHelper";
import { userService } from "./user.service";
import { ROLE, type USERSTATUS } from "../../../generated/prisma/enums";

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can oversee the users",
        data: null,
      });
    }
    const { search, status } = req.query;
    const querySearch = (search as string) || "";

    const queryStatus = (status as USERSTATUS) || "";

    const { page, limit, skip } = await paginationSortingHelper(req.query);
    const result = await userService.getAllUser(
      page,
      limit,
      skip,
      querySearch,
      queryStatus
    );
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
};
const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    if (req.user?.role !== ROLE.admin) {
      return res.status(400).json({
        success: false,
        messsage: "Only admin can update the user status",
        data: null,
      });
    }
   const data=await req.body;

    const result = await userService.updateStatus(data);
    if (result.success) {
      return res.status(200).json(result);
    }
    return res.status(400).json(result);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  getAllUser,
  updateStatus
};
