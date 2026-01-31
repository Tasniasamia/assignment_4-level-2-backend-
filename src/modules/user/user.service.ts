import type { USERSTATUS } from "../../../generated/prisma/enums";
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
export const userService = {
  getAllUser
};
