import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { Order, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata = {
  title: "Order Details",
};
const OrderDetailsPage = async (props: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await props.params;

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const normalizedOrder: Omit<Order, "paymentResult"> = {
    ...order,
    shippingAddress: order.shippingAddress as ShippingAddress,
    orderItems: order.OrderItem, // 🔁 Fix naming mismatch
    isDelivered: order.isDelivered, // ✅ add if missing
    deliveredAt: order.deliveredAt, // ✅ add if missing
  };

  const session = await auth();

  let client_secret = null;

  // Check if is not paid and using stripe

  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // Now create a payment intent

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "PHP",
      metadata: { orderID: order.id },
    });

    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailsTable
        order={normalizedOrder}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === "admin" || false}
      />
    </>
  );
};

export default OrderDetailsPage;
