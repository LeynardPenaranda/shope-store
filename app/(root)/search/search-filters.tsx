import Link from "next/link";

type FilterProps = {
  q?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
  categories: { category: string; _count: number }[];
};

const prices = [
  { name: "₱50 to ₱100", value: "50-100" },
  { name: "₱100 to ₱200", value: "100-200" },
  { name: "₱200 to ₱300", value: "200-300" },
  { name: "₱300 to ₱400", value: "300-400" },
  { name: "₱400 to ₱500", value: "400-500" },
  { name: "₱500 to ₱600", value: "500-600" },
  { name: "₱600 to ₱700 above", value: "600-200000" },
];

const ratings = [4, 3, 2, 1];

const SearchFilters = ({
  q = "all",
  category = "all",
  price = "all",
  rating = "all",
  sort = "newest",
  page = "1",
  categories = [],
}: FilterProps) => {
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

  return (
    <div className="filter-links">
      {/* Category Filters */}
      <div className="mb-4 mt-3">
        <span className="text-2xl">Categories</span>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${
                category === "all" || category === "" ? "font-bold" : ""
              }`}
              href={getFilterUrl({ c: "all" })}
              scroll={false}
            >
              Any
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.category}>
              <Link
                className={`${category === cat.category ? "font-bold" : ""}`}
                href={getFilterUrl({ c: cat.category })}
                scroll={false}
              >
                {cat.category} <span className="text-sm">({cat._count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filters */}
      <div className="mb-4 mt-3">
        <span className="text-2xl">Price</span>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${price === "all" ? "font-bold" : ""}`}
              href={getFilterUrl({ p: "all" })}
              scroll={false}
            >
              Any
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                className={`${price === p.value ? "font-bold" : ""}`}
                href={getFilterUrl({ p: p.value })}
                scroll={false}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating Filters */}
      <div className="mb-4 mt-3">
        <span className="text-2xl">Customer Ratings</span>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${rating === "all" ? "font-bold" : ""}`}
              href={getFilterUrl({ r: "all" })}
              scroll={false}
            >
              Any
            </Link>
          </li>
          {ratings.map((r) => (
            <li key={r}>
              <Link
                className={`${rating === r.toString() ? "font-bold" : ""}`}
                href={getFilterUrl({ r: r.toString() })}
                scroll={false}
              >
                {r} stars & up
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
