"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/useToast";
import { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { ArrowRight, BaggageClaim, Loader2, Minus, Plus } from "lucide-react";
import { formatToPHP } from "@/utils/helper";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const { success, warning } = useToast();
  const [isPending, startTransition] = useTransition();
  const [buttonClick, setButtonClick] = useState("");

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty.{" "}
          <Button>
            <Link href="/">Go Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-4 flex flex-col sm:flex-row gap-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.image}
                          width={50}
                          height={50}
                        />
                        <span className="hidden sm:block px-2">
                          {item.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        className="cursor-pointer"
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setButtonClick("Minus");
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );

                            if (!res.success) {
                              warning(res.message);
                            }
                          });
                        }}
                      >
                        {isPending && buttonClick === "Minus" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        className="cursor-pointer"
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setButtonClick("Add");
                          startTransition(async () => {
                            const res = await addItemToCart(item);

                            if (!res.success) {
                              warning(res.message);
                            }
                          });
                        }}
                      >
                        {isPending && buttonClick === "Add" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatToPHP(Number(item.price))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Card>
              <CardContent className="p-4 gap-4">
                <div className="pb-3 text-xl">
                  Subtotal (
                  <span className="font-bold">
                    {cart.items.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                  ):
                  <span className="font-bold">
                    {formatToPHP(Number(cart.itemsPrice))}
                  </span>
                </div>

                <Button
                  className="w-full cursor-pointer"
                  disabled={isPending}
                  onClick={() => {
                    setButtonClick("shipping");
                    startTransition(() => router.push("/shipping-address"));
                  }}
                >
                  {isPending && buttonClick === "shipping" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <BaggageClaim />
                      <ArrowRight />
                    </>
                  )}
                  Check Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
