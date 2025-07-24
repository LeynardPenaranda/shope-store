"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full cursor-pointer">
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Place Order Now
      </Button>
    );
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
