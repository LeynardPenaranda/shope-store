"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const UserSideBar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="flex md:flex-col text-center items-center justify-center gap-4">
      <Link
        href="/user/profile"
        className={`${
          pathname === "/user/profile"
            ? `font-bold border-b-2 border-foreground md:border-none`
            : `text-gray-500`
        } md:w-full h-[2rem] md:hover:bg-accent flex items-center justify-center`}
      >
        Profile
      </Link>
      <Link
        href="/user/orders"
        className={`${
          pathname === "/user/orders"
            ? `font-bold border-b-2 border-foreground md:border-none`
            : `text-gray-500`
        } md:w-full h-[2rem] md:hover:bg-accent flex items-center justify-center`}
      >
        Orders
      </Link>
    </div>
  );
};

export default UserSideBar;
