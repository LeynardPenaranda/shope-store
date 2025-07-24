"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ButtonLinkProps = {
  href: string;
};

const ButtonLink = ({ href }: ButtonLinkProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const redirectToDetails = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <Button variant="outline" onClick={() => redirectToDetails()}>
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      Details
    </Button>
  );
};

export default ButtonLink;
