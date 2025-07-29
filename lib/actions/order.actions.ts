"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult, ShippingAddress } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@/lib/generated/prisma";
import { sendPurchaseReceipt } from "@/email";

//Create order and create the order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    //Create Order object

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //Create a transaction to create order  and order items in database

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //First to do is to create order
      const insertedOrder = await tx.order.create({
        data: order,
      });

      //Second is to create order items from the cart items

      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: { ...item, price: item.price, orderId: insertedOrder.id },
        });
      }

      //Clear the cart now
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order is not created");

    return {
      success: true,
      message: "Order Created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Get Order by Id

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      OrderItem: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

//Create new PayPal order

export async function createPayPalOrder(orderId: string) {
  try {
    //first get the order from the database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      // Now create the paypal order by calling order function in paypal.ts file
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Approve paypal order and update order to paid

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not Found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal Payment");
    }

    //Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${order}`);
    return {
      success: true,
      message: "Your Order has been paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { OrderItem: true },
  });
  if (!order) throw new Error("Order not Found");

  if (order.isPaid) throw new Error("Order is already Paid");

  // Transaction to update order and account for product stock

  await prisma.$transaction(async (tx) => {
    //Iterate over products and update the stocks

    for (const item of order.OrderItem) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    //Set the order to paid

    await tx.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), paymentResult },
    });
  });

  //Get updated order after the transaction

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: { OrderItem: true, user: { select: { name: true, email: true } } },
  });

  if (!updatedOrder) throw new Error("Order not Found");

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
      orderItems: updatedOrder.OrderItem,
    },
  });
}

// Get user orders table

export async function getMyOrder({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User not authorized");

  const order = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    include: { OrderItem: { select: { image: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const orderCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    order,
    totalPages: Math.ceil(orderCount / limit),
  };
}

// Get Sales data and order summary

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export async function getOrderSummary() {
  //Get the count for each resources
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  //calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });
  //get monthly sales

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  //get latest sales

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// get  all order this is for admin

export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: { name: true },
      },
      OrderItem: {
        select: {
          image: true,
        },
      },
    },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPage: Math.ceil(dataCount / limit),
  };
}

/// This is to delete an order

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update the order to COD

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({
      orderId,
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Order marked as Paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//Update COD order to delivered

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error("Order not Found");

    if (!order.isPaid) throw new Error("Order is not Paid");
    await prisma.order.update({
      where: { id: orderId },
      data: { isDelivered: true, deliveredAt: new Date() },
    });
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Order has been marked delivered",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
