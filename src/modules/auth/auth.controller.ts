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
import type { loginData, resisterData, userType } from "./auth.interface";

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

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const userdata=await req.user;
    const result = await authService.getProfile(userdata as userType);

    if (result.success) {
      return res.status(200).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const userdata=await req.user;
    const payload=await req.body;
    const result = await authService.updateProfile(userdata as userType,payload);

    if (result.success) {
      return res.status(200).json(result);
    }

    next(result);
  } catch (error) {
    next(error);
  }
};


export const authController = { resister, login, getProfile,updateProfile };
