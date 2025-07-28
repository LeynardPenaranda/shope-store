import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.action";
import { PanelLeftOpen } from "lucide-react";
import Link from "next/link";

type PriceOptions = {
  name: string;
  value: string;
};

type FilterParams = {
  q?: string;
  category?: string;
  price?: string;
  sort?: string;
  page?: string;
  rating?: string;
};

type GetFilterUrlParams = {
  c?: string;
  s?: string;
  p?: string;
  r?: string;
  pg?: string;
};

const FilterDrawer = async ({
  prices,
  ratings,
  params,
  getFilterUrl,
}: {
  prices: PriceOptions[];
  ratings: number[];
  params: FilterParams;
  getFilterUrl: (params: GetFilterUrlParams) => string;
}) => {
  const { q, category, price, sort, page, rating } = params;
  const categories = await getAllCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button>
          <PanelLeftOpen />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="md:hidden">
        <DrawerHeader>
          <DrawerTitle>Filters Drawer</DrawerTitle>
          <div className="filter-links">
            {/* Category Filters */}
            <div className="mb-4 mt-3">
              <span className="text-1xl">Categories</span>
              <ul className="space-y-1">
                <li>
                  <DrawerClose>
                    <Link
                      className={`${
                        category === "all" || category === "" ? "font-bold" : ""
                      } text-[.8rem]`}
                      href={getFilterUrl({ c: "all" })}
                      scroll={false}
                    >
                      Any
                    </Link>
                  </DrawerClose>
                </li>
                {categories.map((cat) => (
                  <li key={cat.category}>
                    <DrawerClose>
                      <Link
                        className={`${
                          category === cat.category ? "font-bold" : ""
                        } text-[.8rem]`}
                        href={getFilterUrl({ c: cat.category })}
                        scroll={false}
                      >
                        {cat.category}{" "}
                        <span className="text-[.8rem]">({cat._count})</span>
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filters */}
            <div className="mb-4 mt-3">
              <span className="text-1xl">Price</span>
              <ul className="space-y-1">
                <li>
                  <DrawerClose>
                    <Link
                      className={`${
                        price === "all" ? "font-bold" : ""
                      } text-[.8rem]`}
                      href={getFilterUrl({ p: "all" })}
                      scroll={false}
                    >
                      Any
                    </Link>
                  </DrawerClose>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <DrawerClose>
                      <Link
                        className={`${
                          price === p.value ? "font-bold" : ""
                        } text-[.8rem]`}
                        href={getFilterUrl({ p: p.value })}
                        scroll={false}
                      >
                        {p.name}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating Filters */}
            <div className="mb-4 mt-3">
              <span className="text-1xl">Customer Ratings</span>
              <ul className="space-y-1">
                <li>
                  <DrawerClose>
                    <Link
                      className={`${
                        rating === "all" ? "font-bold" : ""
                      }text-[.8rem]`}
                      href={getFilterUrl({ r: "all" })}
                      scroll={false}
                    >
                      Any
                    </Link>
                  </DrawerClose>
                </li>
                {ratings.map((r) => (
                  <li key={r}>
                    <DrawerClose>
                      <Link
                        className={`${
                          rating === r.toString() ? "font-bold" : ""
                        } text-[.8rem]`}
                        href={getFilterUrl({ r: r.toString() })}
                        scroll={false}
                      >
                        {r} stars & up
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
