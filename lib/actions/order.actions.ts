"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

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
async function updateOrderToPaid({
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
