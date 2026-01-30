// import type { NextFunction, Request, Response } from "express"
// import { authService } from "./auth.service"
// import type { loginData, resisterData } from "./auth.interface";

// const resister=async(req:Request,res:Response,next:NextFunction)=>{
//     try{
//         const payload=await (req.body as resisterData)
//        const result=await authService.resister(payload);
//        console.log("result",result);
//        if(result?.success){
//        return res.status(201).json(result);
//        }
//       next(result);
//     }
//     catch(error:any){
// next(error);
//     }
// }

// const login = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const payload = req.body as loginData;
//       const headers =await req.headers as Record<string,string>;
  
//       const result = await authService.login(payload, headers);
  
//       if (result.success) {
//         // res.cookie("better-auth.session_token", result.data.token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === "production",
//         //     sameSite: "lax",
//         //   });
//         return res.status(201).json(result); 
//       }
//     //   sign-in/email
//       next(result);
//     } catch (error: any) {
//       next(error); 
//     }
//   };

//   const session=async(req:Request,res:Response,next:NextFunction)=>{
//     try{
//         const headers = req.headers as Record<string,string>;

//           const result=await authService.session(headers);
//           if(result.success){
//           return res.status(200).json(result);
//           }
//           next(result)
//     }
//     catch(error:any){
// next(error)
//     }
//   }
  

// export const authController={
//     resister,login,session
// }



import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import type { loginData, resisterData } from "./auth.interface";
import { auth } from "../../lib/auth";

const toStringHeaders = (headers: Request["headers"]): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in headers) {
    const value = headers[key];
    if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
};

const resister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as resisterData;
    const result = await authService.resister(payload);

    if (result.success) {
      return res.status(201).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body as loginData;


    const result = await authService.login(payload,res);
    console.log("result",result);

    if (result.success) {
    
      return res.status(200).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};

const session = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headers = toStringHeaders(req.headers);
   console.log("session headers",headers);
    const result = await authService.session(headers);

    if (result.success) {
      return res.status(200).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};

export const authController = { resister, login, session };
