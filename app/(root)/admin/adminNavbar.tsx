"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSearch from "./admin-search";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
];

const AdminNavbar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        {links.map((link) => (
          <div key={link.title}>
            <Link
              href={link.href}
              className={`text-[.8rem] md:text-[1.1rem] relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:transition-transform after:duration-300 after:origin-left ${
                pathname === link.href ? "after:scale-x-100" : "after:scale-x-0"
              }`}
            >
              {link.title}
            </Link>
          </div>
        ))}
      </div>

      <AdminSearch />
    </>
  );
};

export default AdminNavbar;
