import { ORDERSTATUS, ROLE } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { CreateOrderPayload } from "./order.interface";

const createOrder = async ({ userId, deliveryAddress }: CreateOrderPayload) => {
  return await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId,
        orderId: null,
      },
      include: {
        meal: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.meal.price * item.quantity;
    }, 0);

    const order = await tx.order.create({
      data: {
        customerId: userId,
        deliveryAddress,
        totalAmount,
        status: ORDERSTATUS.PLACED,
      },
    });

    await tx.cartItem.updateMany({
      where: {
        userId,
        orderId: null,
      },
      data: {
        orderId: order.id,
      },
    });
    if (order) {
      return {
        success: true,
        data: order,
        message: "Order has been placed",
      };
    }
    return {
      success: null,
      data: null,
      message: "Order placed failed",
    };
  });
};
const getOrder = async (
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string,
  user: {
    id: string;
    name: string;
    email: string;
    role: string | undefined;
    emailVerified: boolean;
  }
) => {
  // const anyConditions: OrderWhereInput[] = [];

  let findData, total;
  if (user?.role === ROLE.customer) {
    findData = await prisma.order.findMany({
      skip: skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      where: { customerId: user?.id },
      include: {
        items: {
          include: {
            meal: {
              include: { provider: { include: { ProviderProfiles: true } } },
            },
          },
        },
      },
    });
    total = await prisma.order.count({
      where: { customerId: user?.id },
    });
  } else if (user?.role === ROLE.provider) {
    findData = await prisma.order.findMany({
      skip: skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      where: {
        items: {
          some: {
            meal: {
              providerId: user.id,
            },
          },
        },
      },
      include: {
        items: {
          where: {
            meal: {
              providerId: user.id,
            },
          },
          include: {
            meal: {
              include: {
                provider: {
                  include: {
                    ProviderProfiles: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    total = await prisma.order.count({
      where: {
        items: {
          some: {
            meal: { providerId: user.id },
          },
        },
      },
    });
  } else if (user?.role === ROLE.admin) {
    findData = await prisma.order.findMany({
      skip: skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      include: {
        items: {
          include: {
            meal: {
              include: { provider: { include: { ProviderProfiles: true } } },
            },
          },
        },
      },
    });
    total = await prisma.order.count({});
  }

  if (findData) {
    return {
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: total && Math.ceil(total / limit),
      },
      data: findData,
    };
  }

  return {
    success: false,
    data: null,
  };
};
const updateOrder = async (
  id: string,
  authenticator: {
    id: string;
    name: string;
    email: string;
    role: string | undefined;
    emailVerified: boolean;
  },
  data: {
    status: ORDERSTATUS;
  }
) => {
  console.log("coming update order service");
  let findOrder;
  if (authenticator?.role === ROLE.customer) {
    console.log("authenticator", authenticator);
    findOrder = await prisma.order.findFirst({
      where: { id: id, customerId: authenticator?.id },
    });
    console.log("findOrder", findOrder);
    if (!findOrder || data?.status != ORDERSTATUS.CANCELLED) {
      return {
        success: false,
        message: !findOrder
          ? "Order not found"
          : "Customer can only cancelled the order",
        data: null,
      };
    }
  } 
  else if (authenticator?.role === ROLE.provider) {
    findOrder = await prisma.order.findFirst({
      where: {
        id: id,
        items: {
          some: {
            meal: {
              providerId: authenticator.id,
            },
          },
        },
      },
    });
    if (
      !findOrder ||
      !["PREPARING", "READY", "DELIVERED"].includes(data.status)
    ) {
      return {
        success: false,
        message: !findOrder
          ? "Order not found"
          : "Provider can only set status to Preparing, Ready, or Delivered",
        data: null,
      };
    }
  }

  console.log("before status update");
  console.log("orderId",id);
  const status: ORDERSTATUS = ORDERSTATUS[data.status as keyof typeof ORDERSTATUS];

  const updateData = await prisma.order.update({
    where:{id:id},
    data:{status:status}
  });
    if (updateData) {
      return {
        success: true,
        data: updateData,
        message: "Order Status updated successfully",
      };
    }
  

  return {
    success: false,
    data: null,
    message: "Order Status update failed",
  };
};

const getSingleOrder = async (id: string) => {
  const findOrder = await prisma.order.findUnique({
    where: { id: id },
    include: {
      items: {
        include: {
          meal: {
            include: { provider: { include: { ProviderProfiles: true } } },
          },
        },
      },
    },
  });
  if (findOrder) {
    return { success: true, data: findOrder };
  }
  return {
    success: false,
    data: null,
  };
};
const deleteOrder = async (id: string) => {
  const deleteOrder = await prisma.order.delete({ where: { id: id } });
  if (deleteOrder) {
    return { success: true, data: deleteOrder ,message:"Order deleted successfully"};
  }
  return {
    success: false,
    data: null,
    message:"Order deletion failed"
  };
};

export const orderService = {
  createOrder,
  getOrder,
  updateOrder,
  getSingleOrder,
  deleteOrder,
};
