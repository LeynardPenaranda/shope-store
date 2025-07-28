import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPaymenPage = async (props: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { orderId } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  const order = await getOrderById(orderId);

  if (!order) notFound();

  //Retrieve the payment Intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  //Check if paymentIntent is valid
  if (
    paymentIntent.metadata.orderID == null ||
    paymentIntent.metadata.orderID !== order.id.toString()
  ) {
    return notFound();
  }

  //check if payment is successfull
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) {
    return redirect(`/order/${orderId}`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-20">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold text-center">Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/order/${orderId}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPaymenPage;
