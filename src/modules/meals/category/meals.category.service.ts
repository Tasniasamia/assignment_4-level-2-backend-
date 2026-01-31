import { prisma } from "../../../lib/prisma"

const addCategory=async(data:any)=>{

const insertdata=await prisma.categories.create({data})
if(insertdata?.id){
    return {
        success:true,
        message:"Category Created Successfully",
        data:insertdata
    }

}
return {
    success:false,
    message:'Failed to create category',
    data:insertdata
  }
}
export const mealsCategoryService={
    addCategory
}