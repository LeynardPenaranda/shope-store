import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/checkout-steps";
import { getUserById } from "@/lib/actions/user.action";
import PaymentMethodForm from "./payment-method-form";

export const metadata = {
  title: "Select Payment Method",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not Found");
  const user = await getUserById(userId);

  return (
    <>
      <CheckOutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
