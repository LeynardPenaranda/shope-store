"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { useToast } from "@/lib/hooks/useToast";
import { paymentMethodSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Banknote, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { success, warning } = useToast();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        warning(res.message);
        return;
      }
      router.push("/place-order");
    });
    return;
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4 mb-8">
        <h1 className="h2-bold mt-4 text-center">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select the payment method
        </p>

        <Form {...form}>
          <form
            method="post"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row gap-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-2 "
                      >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <FormItem
                            key={paymentMethod}
                            className="flex items-center space-x-3"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={paymentMethod}
                                checked={field.value === paymentMethod}
                                className="cursor-pointer"
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {paymentMethod}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer w-full sm:w-[10rem]"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Banknote />
                    <span>Submit</span>
                    <ArrowRight />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
