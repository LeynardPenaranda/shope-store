"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertcartSchema } from "../validator";
import { revalidatePath } from "next/cache";

//Calculate cart prices

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookie

    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Session cart not found");

    //get session and user ID

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    //parse and Validate
    const item = cartItemSchema.parse(data);

    //Find product in Database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not Found");

    if (!cart) {
      // if there's item from a certain cookier or user in the cart create new cart object
      const newCart = insertcartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      //Add to database

      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product Page

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} Added to Cart`,
      };
    } else {
      //else if item already in the cart

      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        //check the stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not enough Stock");
        }

        //Increase the Quantity

        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        //if the item does not exist in cart

        //check the stock
        if (product.stock < 1) {
          throw new Error("Not enough Stock");
        }

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: { items: cart.items, ...calcPrice(cart.items as CartItem[]) },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated In" : `added to`
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Session cart not found");

  //get session and user ID

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //Get user cart from database

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //Convert decimals and return

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Session cart not found");

    // Get Product

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not Found");

    //Get user cart

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    //Check for item

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    //Check if only one in qty
    if (exist.qty === 1) {
      //Remove from the cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      //Decrease cart qty

      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }

    //Udpate cart in database

    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: cart.items, ...calcPrice(cart.items as CartItem[]) },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was remove from the cart`,
    };
  } catch (error) {
    return {
      success: false,

      message: formatError(error),
    };
  }
}
