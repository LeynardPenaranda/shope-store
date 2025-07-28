import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllCategories, getAllProducts } from "@/lib/actions/product.action";
import Link from "next/link";
import FilterDrawer from "./filter-drawer";
import SelectFilter from "./select-filter";
import { title } from "process";

const prices = [
  {
    name: "₱50 to ₱100",
    value: "50-100",
  },
  {
    name: "₱100 to ₱200",
    value: "100-200",
  },
  {
    name: "₱200 to ₱300",
    value: "200-300",
  },
  {
    name: "₱300 to ₱400",
    value: "300-400",
  },
  {
    name: "₱400 to ₱500",
    value: "400-500",
  },
  {
    name: "₱500 to ₱600",
    value: "500-600",
  },
  {
    name: "₱600 to ₱700 above",
    value: "600-200000",
  },
];

const ratings = [4, 3, 2, 1];

const sortProducts = ["newest", "lowest", "highest", "rating"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";
  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search 
      ${isQuerySet ? q : ``} 
      ${isCategorySet ? `Category: ${category} ` : ``} 
      ${isPriceSet ? `Price: ${price}` : ``} 
      ${isRatingSet ? `Rating: ${rating}` : ``}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  //Construct Filter URL

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const searchParams = await props.searchParams;
  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    page: Number(page),
    sort,
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-4 mt-20 mx-5">
      <div className="filter-links hidden md:block">
        {/*Categories Filters */}
        <div className="mb-4 mt-3">
          <span className="text-2xl">Categories</span>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${
                    (category === "all" || category === "") && `font-bold`
                  }`}
                  href={getFilterUrl({ c: "all" })}
                >
                  Any
                </Link>
              </li>

              {categories.map((filter) => (
                <li key={filter.category}>
                  <Link
                    className={`${
                      category === filter.category && `font-bold`
                    } `}
                    href={getFilterUrl({ c: filter.category })}
                  >
                    {filter.category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Price Filters */}
        <div className="mb-4 mt-3">
          <span className="text-2xl">Price</span>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${price === "all" && `font-bold`}`}
                  href={getFilterUrl({ p: "all" })}
                >
                  Any
                </Link>
              </li>

              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={`${price === p.value && `font-bold`} `}
                    href={getFilterUrl({ p: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*Rating Filters */}
        <div className="mb-4 mt-3">
          <span className="text-2xl">Customer Ratings</span>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${rating === "all" && `font-bold`}`}
                  href={getFilterUrl({ r: "all" })}
                >
                  Any
                </Link>
              </li>

              {ratings.map((r) => (
                <li key={r}>
                  <Link
                    className={`${rating === r.toString() && `font-bold`} `}
                    href={getFilterUrl({ r: `${r}` })}
                  >
                    {`${r} stars & up`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && " Category: " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Ratings: " + rating + `stars & up`}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            (rating !== "all" && rating !== "") ||
            (price !== "all" && price !== "") ? (
              <Button variant={"link"} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="md:hidden mx-2">
              <FilterDrawer
                prices={prices}
                ratings={ratings}
                params={searchParams}
                getFilterUrl={getFilterUrl}
              />
            </div>
            {/* Sort */}
            <span className="hidden md:block">Sort By</span>{" "}
            <div className="hidden md:block">
              {sortProducts.map((s) => (
                <Link
                  key={s}
                  className={`${sort === s && "font-bold"} mx-2`}
                  href={getFilterUrl({ s })}
                  scroll={false}
                >
                  {s}
                </Link>
              ))}
            </div>
            <div className="md:hidden">
              <SelectFilter />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 place-items-center">
          {products.data.length === 0 && <div>No products found.</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
