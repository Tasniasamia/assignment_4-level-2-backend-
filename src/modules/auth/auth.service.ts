// import { auth } from "../../lib/auth";
// import type { loginData,resisterData } from "./auth.interface"
// import { fromNodeHeaders } from "better-auth/node";

// const resister=async(payload:resisterData)=>{
//     const data = await auth.api.signUpEmail({body:payload});
//     if(data?.user){
//         return  {
//             success:true,
//             data:{...data},
//             messsage:'User Resistered Successfully'
//         }
//     }
//     return {
//         success:false,
//         message:"User Registration Failed",
//         data:{...data}
//     };
// }

// const login=async(payload:loginData,headers: Record<string,string>)=>{
//     const data = await auth.api.signInEmail({
//         body: payload,
//         headers: await headers,
//     });
//     console.log("signindata",data);
//     if(data?.user){
//         return  {
//             success:true,
//             data:{...data},
//             messsage:'Login Successfully'
//         }
//     }
//     return {
//         success:false,
//         message:"Login Failed",
//         data:{...data}
//     };
// }
// const session=async(headers: Record<string,string>)=>{
//     console.log("headers",headers)
// 	const data = await auth.api.getSession({
//         headers: fromNodeHeaders(headers),
//       });
//     console.log("data",data);
//     if(data){
//         return  {
//             success:true,
//             data:data,
//         }
//     }
//     return {
//         success:false,
//         message:"User not found",
//         data:data
//     };
    
// }
// export const authService={
//     resister,login,session
// }

import type { Response } from "express";
import { auth } from "../../lib/auth";
import type { loginData, resisterData, userType } from "./auth.interface";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../../lib/prisma";
import { ROLE } from "../../../generated/prisma/enums";

const resister = async (payload: resisterData) => {
  const data = await auth.api.signUpEmail({ body: payload });

  if (data?.user) {
    return {
      success: true,
      data,
      message: "User Registered Successfully",
    };
  }

  return {
    success: false,
    message: "User Registration Failed",
    data,
  };
};

const login = async (
  payload: loginData,
  res:Response
) => {
console.log("login payload",payload)

const responsedata=await fetch(`${process.env.API_URL}/api/auth/sign-in/email`,{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Origin":"http://localhost:3000"
  },
  credentials: "include", 
  body: JSON.stringify(payload),
})
const data=await responsedata.json();
const setCookie = responsedata.headers.get("set-cookie");
console.log("setCookie",setCookie);
  console.log("signInData", data);
  
  if (setCookie) {
    res.setHeader("Set-Cookie", setCookie);
   
  }
  


  if (data) {
    return {
      success: true,
      data:{...data},
      message: "Login Successfully",
    };
  }

  return {
    success: false,
    message: "Login Failed",
    data,
  };
};

const getProfile = async (userdata:userType) => {
  const data =await prisma.user.findUnique({
    where:{id:userdata?.id}
  })


 if((data?.role===ROLE.provider) && (userdata?.role===ROLE.provider)){
  console.log("coming here");
   const providerdata=await prisma.providerProfiles.findUnique({
    where:{userId:data?.id}
   })
   return {
    success:true,
    data:{...data,providerdata}
   }
  }


  if (data) {
    return { success: true, data };
  }

  return {
    success: false,
    message: "User not found",
    data,
  };
};

export const authService = { resister, login, getProfile };
