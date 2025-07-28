import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/checkout-steps";

import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.action";
import { ShippingAddress } from "@/types";

import { redirect } from "next/navigation";
import CardList from "./CardList";
import { Card, CardContent } from "@/components/ui/card";
import { formatToPHP } from "@/utils/helper";
import PlaceOrderForm from "./place-order-form";

export const metadata = {
  title: "Place Order",
};
const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not Found");

  const user = await getUserById(userId);
  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user?.address as ShippingAddress;

  return (
    <>
      <span className="hidden md:block">
        <CheckOutSteps current={3} />
      </span>
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <CardList userAddress={userAddress} user={user} cart={cart} />
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items total Price:</div>
                <div>{formatToPHP(Number(cart.itemsPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax total Price:</div>
                <div>{formatToPHP(Number(cart.taxPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping total Price:</div>
                <div>{formatToPHP(Number(cart.shippingPrice))}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold">Total:</div>
                <div className="font-bold">
                  {formatToPHP(Number(cart.totalPrice))}
                </div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
