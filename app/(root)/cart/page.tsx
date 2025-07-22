import { getMyCart } from "@/lib/actions/cart.action";
import CartTable from "./cart-table";

export const metadata = {
  title: "Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
