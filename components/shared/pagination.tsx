"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const [isPending, startTransition] = useTransition();
  const [loadingClicked, setLoadingClicked] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (btnType: string) => {
    setLoadingClicked(btnType);
    startTransition(() => {
      const pageValue =
        btnType === "next" ? Number(page) + 1 : Number(page) - 1;

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || "page",
        value: pageValue.toString(),
      });

      router.push(newUrl, { scroll: false });
    });
  };
  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className={`w-28 cursor-pointer`}
        disabled={Number(page) <= 1}
        onClick={() => handleClick("prev")}
      >
        {isPending && loadingClicked === "prev" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Prev
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={`w-28 cursor-pointer`}
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick("next")}
      >
        {isPending && loadingClicked === "next" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Next
      </Button>
    </div>
  );
};

export default Pagination;
