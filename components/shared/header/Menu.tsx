import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButtonProfile from "./user-button";
import { getMyCart } from "@/lib/actions/cart.action";
const Menu = async () => {
  const cart = await getMyCart();
  const cartLength = cart?.items?.reduce((acc, item) => acc + item.qty, 0) ?? 0;
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <div className="relative">
              <span className="absolute top-[-18px] right-[-4] bg-accent-foreground text-background px-2 rounded-full">
                {cartLength === 0 ? `` : cartLength}
              </span>
              <ShoppingCart className="h-20 w-20" />
            </div>
          </Link>
        </Button>
        <UserButtonProfile />
      </nav>
      <nav className="md:hidden flex flex-row gap-4">
        <Link href="/cart">
          <div className="relative">
            <span className="absolute top-[-20px] right-[-4] bg-accent-foreground text-background px-2 rounded-full">
              {cartLength === 0 ? `` : cartLength}
            </span>
            <ShoppingCart className="h-5 w-5" />
          </div>
        </Link>
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost"></Button>
            <Button asChild variant="ghost">
              <UserButtonProfile />
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
