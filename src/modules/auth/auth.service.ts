
import type { Response } from "express";
import { auth } from "../../lib/auth";
import type { loginData, resisterData, updateUserType, userType } from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { ROLE } from "../../../generated/prisma/enums";

const resister = async (payload: resisterData) => {
  try{
  const data = await auth.api.signUpEmail({ body: payload });

  if (data?.user?.id) {
   const updateData= await prisma.user.update({
      where: {
        id: data?.user?.id as string,
      },
      data: {
        role: payload.role,
      },
    });
        return {
      success: true,
      data:updateData,
      message: "User Registered Successfully",
    };
  }

  return {
    success: false,
    message: "User Registration Failed",
    data,
  };
}
  catch(error:any){
    return {
     success:false,
     data:JSON.stringify(error),
     message:error?.message
    }
   }
};

const login = async (
  payload: loginData,
  res:Response
) => {
try{
const responsedata=await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-in/email`,{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Origin":"http://localhost:3000"
  },
  credentials: "include", 
  body: JSON.stringify(payload),
})
const data:any=await responsedata.json();
const setCookie = responsedata.headers.get("set-cookie");
  
 
  

  if (!data?.code) {
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
     
    }
    const userdata=await prisma.user.findUnique({where:{id:data?.user?.id}});
    return {
      success: true,
      data:{...userdata},
      message: "Login Successfully",
    };
  }

  return {
    success: false,
    message: data?.code? data?.message :"Login Failed",
    data,
  };
}
catch(error:any){
 return {
  success:false,
  data:JSON.stringify(error),
  message:error?.message
 }
}
};

const getProfile = async (userdata:userType) => {

  const data =await prisma.user.findUnique({
    where:{id:userdata?.id}
  })
  if(data?.role !== userdata?.role){
    return {
      success:false,
      message:`You are authenticated as ${data?.role} but try to find your profile ${userdata?.role}
       `,
       data:data
    }
  }


 if((data?.role===ROLE.provider) && (userdata?.role===ROLE.provider)){
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
const updateProfile = async (userdata:userType,payload:updateUserType) => {
  if(payload?.id !== userdata?.id){
    return {
      success:false,
      message:'Payload data and session data are not matched',
      data:userdata
    }
  }
  const data =await prisma.user.findUnique({
    where:{id:userdata?.id}
  })

  if(data?.role !== userdata?.role){
    return {
      success:false,
      message:`You are authenticated as ${data?.role} but try to find your profile ${userdata?.role}
       `,
       data:data
    }
  }

  const updateData=await prisma.user.update({
    where:{id:payload?.id},
    data:{...payload}
  })

  if (updateData) {
    return { success: true,message:"profile updated successfully" ,data:{...updateData} };
  }

  return {
    success: false,
    message: "User not found",
    data:updateData || null,
  };
};
export const authService = { resister, login, getProfile ,updateProfile};
