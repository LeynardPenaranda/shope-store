"use client";

import { APP_NAME } from "@/lib/constants";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const MenuLogo = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
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
  );
};

export default MenuLogo;
