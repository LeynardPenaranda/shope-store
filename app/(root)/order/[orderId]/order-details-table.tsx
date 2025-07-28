"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateandTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import { formatToPHP } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { useToast } from "@/lib/hooks/useToast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StripePayment from "./stripe-payment";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
    id,
  } = order;
  const { success, warning } = useToast();
  const [isPending, startTransition] = useTransition();

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();

    let status = "";
    if (isPending) {
      status = "Loading Paypal...";
    } else if (isRejected) {
      status = "Error Loading PayPal";
    }

    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      warning(res.message);
    }
    return res.data;
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    if (!res.success) {
      warning(res.message);
    } else if (res.success) {
      success(res.message);
    }
  };

  const MarkAsPaidButton = () => {
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);

            if (!res.success) {
              warning(res.message);
            } else {
              success(res.message);
            }
          })
        }
      >
        {isPending ? (
          <div className="flex gap-2 items-center justify-center ">
            <Loader2 className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          `Mark us paid`
        )}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);

            if (!res.success) {
              warning(res.message);
            } else {
              success(res.message);
            }
          })
        }
      >
        {isPending ? (
          <div className="flex gap-2 items-center justify-center ">
            <Loader2 className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          `Mark us Delivered`
        )}
      </Button>
    );
  };
  return (
    <>
      <h1 className="py-4 text-2xl text-center sm:text-start">
        Order {formatId(id)}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="successOutline">
                  Paid at {formatDateandTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shippin Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p className="mb-2">
                {shippingAddress.streetAddress}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode} , {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="successOutline">
                  Delivered at {formatDateandTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell className="flex items-center">
                        <Link href={`/product/${item.slug}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                          />
                        </Link>
                        <span className="hidden md:block">{item.name}</span>
                      </TableCell>
                      <TableCell>
                        <p>{item.qty}</p>
                      </TableCell>
                      <TableCell>
                        <p>{formatToPHP(Number(item.price))}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items total Price:</div>
                <div>{formatToPHP(Number(itemsPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax total Price:</div>
                <div>{formatToPHP(Number(taxPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping total Price:</div>
                <div>{formatToPHP(Number(shippingPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold">Total:</div>
                <div className="font-bold">
                  {formatToPHP(Number(totalPrice))}
                </div>
              </div>

              {/* PayPal Payment */}

              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider
                    options={{ clientId: paypalClientId, currency: "PHP" }}
                  >
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Stripe  Payment*/}
              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  client_secret={stripeClientSecret}
                />
              )}

              {/* Cash on Delivery */}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
