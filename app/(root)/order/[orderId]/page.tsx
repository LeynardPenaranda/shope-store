import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { Order, ShippingAddress } from "@/types";
import { auth } from "@/auth";

export const metadata = {
  title: "Order Details",
};
const OrderDetailsPage = async (props: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await props.params;

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const normalizedOrder: Order = {
    ...order,
    shippingAddress: order.shippingAddress as ShippingAddress,
    orderItems: order.OrderItem, // 🔁 Fix naming mismatch
    isDelivered: order.isDelivered, // ✅ add if missing
    deliveredAt: order.deliveredAt, // ✅ add if missing
  };

  const session = await auth();

  return (
    <>
      <OrderDetailsTable
        order={normalizedOrder}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user?.role === "admin" || false}
      />
    </>
  );
};

export default OrderDetailsPage;
