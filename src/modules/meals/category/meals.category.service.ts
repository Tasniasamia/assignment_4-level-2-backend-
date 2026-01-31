import { prisma } from "../../../lib/prisma"
import type { addCategory, updateCategory } from "./meals.category.interface"

const addCategory=async(data:addCategory)=>{
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
const updateCategory=async(id:string,data:updateCategory)=>{
    const findCategory=await prisma.categories.findUnique({where:{id:id}});
    if(findCategory){
        const updateData=await prisma.categories.update({where:{id:id},data:{name:data?.name}});
        return {
            success:true,
            message:"Category updated successfully",
            data:updateData
        }
    }
    return {
        success:false,
        message:"Failed to update category",
        data:null
    }
}
const deleteCategory=async(id:string)=>{
    const findCategory=await prisma.categories.findUnique({where:{id:id}});
    if(findCategory){
        const deleteData=await prisma.categories.delete({where:{id:id}});
        return {
            success:true,
            message:"Category deleted successfully",
            data:deleteData
        }
    }
    return {
        success:false,
        message:"Failed to delete category",
        data:null
    }
}
const getAllCategory=async()=>{
    const findCategoryAll=await prisma.categories.findMany({})
    return {
        success:true,
        data:findCategoryAll
    }
}

export const mealsCategoryService={
    addCategory,updateCategory,deleteCategory,getAllCategory
}