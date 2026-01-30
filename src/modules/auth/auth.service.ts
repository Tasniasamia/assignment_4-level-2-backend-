import { auth } from "../../lib/auth";
import type { resisterData } from "./auth.interface"

const resister=async(payload:resisterData)=>{
    const data = await auth.api.signUpEmail({body:payload});
    console.log("resister",data);
    if(data?.user){
        return  {
            success:true,
            data:{...data?.user},
            messsage:'User Resistered Successfully'
        }
    }
    return {
        success:false,
        message:"User Registration Failed",
        data:{...data}
    };
}

export const authService={
    resister
}