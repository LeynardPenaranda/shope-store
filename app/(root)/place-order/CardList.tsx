"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cart, ShippingAddress, User } from "@/types";
import { formatToPHP } from "@/utils/helper";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const CardList = ({
  user,
  userAddress,
  cart,
}: {
  user: User;
  userAddress: ShippingAddress;
  cart: Cart;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRedirect = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 gap-4">
          <h2 className="text-xl pb-4 font-bold">Shipping Address</h2>
          <p className="text-gray-500">{userAddress.fullName}</p>
          <p className="text-gray-500">
            {userAddress.streetAddress}, {userAddress.City}{" "}
            {userAddress.postalCode}, {userAddress.country}{" "}
          </p>
          <div className="mt-3">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleRedirect("/shipping-address")}
              className="cursor-pointer"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Edit Address
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 gap-4">
          <h2 className="text-xl pb-4 font-bold">Payment Method</h2>
          <p className="text-gray-500">{user.paymentMethod}</p>

          <div className="mt-3">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleRedirect("/payment-method")}
              className="cursor-pointer"
            >
              Edit Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 gap-4">
          <h2 className="text-xl pb-4 font-bold">Order items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items.map((item) => (
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
    </>
  );
};

export default CardList;
