"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const sortProducts = ["newest", "lowest", "highest", "rating"];

const SelectFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  };
  return (
    <Select onValueChange={handleSelectFilter}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        {sortProducts.map((s) => (
          <SelectItem value={s} key={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFilter;
