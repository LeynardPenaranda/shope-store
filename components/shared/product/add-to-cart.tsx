"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, LoaderCircle } from "lucide-react";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { useToast } from "@/lib/hooks/useToast";
import { useState, useTransition } from "react";

const AddtoCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const { success, error } = useToast();
  const [isPending, startTransition] = useTransition();
  const [buttonClicked, setButtonClicked] = useState("");

  const handleAddtoCart = async () => {
    setButtonClicked("Add");
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        error(res.message);
        return;
      }

      //handleSuccess add to cart

      success(res.message, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  //Check if Item is already in Cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  const handlerRemoveFromCart = async () => {
    setButtonClicked("Minus");
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (res.success) {
        success(res.message);
      } else {
        error(res.message);
      }
    });
  };

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handlerRemoveFromCart}
        disabled={isPending}
      >
        {isPending && buttonClicked === "Minus" ? (
          <LoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleAddtoCart}
        disabled={isPending}
      >
        {isPending && buttonClicked === "Add" ? (
          <LoaderCircle className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full cursor-pointer"
      type="button"
      onClick={handleAddtoCart}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderCircle className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add to Cart
    </Button>
  );
};

export default AddtoCart;
