"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./Menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <Link href="/" className="flex-start">
          {theme === "light" ? (
            <Image
              src="/images/LogoDark.png"
              alt={APP_NAME}
              height={43}
              width={43}
              priority={true}
              className="rounded-sm"
            />
          ) : (
            <Image
              src="/images/LogoLight.png"
              alt={APP_NAME}
              height={43}
              width={43}
              priority={true}
              className="rounded-sm"
            />
          )}
        </Link>

        <div className="flex-row">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
