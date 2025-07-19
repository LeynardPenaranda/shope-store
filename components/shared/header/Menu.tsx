import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import { EllipsisVertical, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart className="h-20 w-20" />
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/signIn">
            <User /> Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden flex flex-row gap-4">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
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
              <Link href="/signIn">
                <User /> Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
