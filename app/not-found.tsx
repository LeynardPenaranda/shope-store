"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const NotFoundPage = () => {
  const { theme } = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  return (
    <div className="flex items-center justify-center min-h-[80vh] text-center">
      <div className="w-[80%] sm:w-[50%] sm:h-[40%] border border-primary rounded-2xl flex flex-col items-center justify-center py-2">
        <Image
          src={
            theme === "light"
              ? "/images/LogoDark.png"
              : theme === "dark"
              ? "/images/LogoLight.png"
              : "/images/LogoLight.png"
          }
          width={68}
          height={48}
          alt={`${APP_NAME}`}
        />
        <h1 className="text-3xl font-bold my-2">Not Found</h1>
        <p className="text-destructive">Could not find page</p>
        <Button
          variant="outline"
          className="mt-4 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
