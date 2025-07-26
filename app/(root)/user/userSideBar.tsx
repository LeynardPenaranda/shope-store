"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Profile",
    href: "/user/profile",
  },
  {
    title: "Orders",
    href: "/user/orders",
  },
];

const UserSideBar = () => {
  const pathname = usePathname();
  return (
    <div className="flex md:flex-col text-center items-center justify-center gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:transition-transform after:duration-300 after:origin-left ${
            pathname === link.href ? "after:scale-x-100" : "after:scale-x-0"
          } md:w-full h-[2rem] md:hover:bg-accent flex items-center justify-center`}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

export default UserSideBar;
