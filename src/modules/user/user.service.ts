import { USERSTATUS } from "../../../generated/prisma/enums";
import type { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllUser = async (
  page: number,
  limit: number,
  skip: number,
  search: string | undefined,
  status: USERSTATUS | undefined
) => {
  const anyConditions: UserWhereInput[] = [];
  if (search) {
    anyConditions.push({
      OR: [
        {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  if (status) {
    anyConditions.push({ status });
  }
  const data = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where: { AND: anyConditions },
  });
  const total = await prisma.user.count({
    where: { AND: anyConditions },
  });

  return {
    success:true,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },

    data: data,
  };
};

const updateStatus=async(data:{id:string})=>{
  const findUSER=await prisma.user.findUnique({where:{id:data?.id}});
  let status=findUSER?.status;
  let userStatus:USERSTATUS;
  
  if(status === USERSTATUS.activate ){
    userStatus=USERSTATUS.suspend;
  }
  else{
    userStatus=USERSTATUS.activate;
  }
  const updateData=await prisma.user.update({
    where:{id:data?.id},
    data:{status:userStatus}
  })
  
 if(updateData){
  return {
    success:true,
    message:'Status updated successfully',
    data:updateData
  }
 }
 return {
  success:false,
  message:'Status update failed',
  data:updateData
 }
}


export const userService = {
  getAllUser,
  updateStatus
};
