import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckOutSteps from "@/components/shared/checkout-steps";

export const metadata = {
  title: "Shipping Address",
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId)
    return (
      <div className="flex-center mt-50">
        <Card>
          <CardContent>
            <h1 className="text-destructive">
              Sorry you can&apos;t access this page because you&apos;re not log
              in to the website
            </h1>
          </CardContent>
        </Card>
      </div>
    );

  const user = await getUserById(userId);

  return (
    <>
      <span className="hidden md:block">
        <CheckOutSteps current={1} />
      </span>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
