"use client";

import { APP_NAME } from "@/lib/constants";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SignInLogo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link href="/" className="flex-center">
      {theme === "light" ? (
        <Image
          src="/images/LogoDark.png"
          alt={`${APP_NAME} Logo`}
          width={100}
          height={100}
          priority={true}
        />
      ) : (
        <Image
          src="/images/LogoLight.png"
          alt={`${APP_NAME} Logo`}
          width={100}
          height={100}
          priority={true}
        />
      )}
    </Link>
  );
};

export default SignInLogo;
