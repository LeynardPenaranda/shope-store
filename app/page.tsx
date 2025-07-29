import DealCountDown from "@/components/deal-coutdown";
import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carouse";
import ProductList from "@/components/shared/product/productList";
import ViewAllProductsButton from "@/components/view-all-products";

import {
  getFeaturedProducts,
  getLatestProduct,
} from "@/lib/actions/product.action";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Home / ${APP_NAME}`,
};

const HomePage = async () => {
  const latestProduct = await getLatestProduct();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {featuredProducts.length > 0 && (
        <div className="w-full flex items-center justify-center">
          <ProductCarousel data={featuredProducts} />
        </div>
      )}
      <ProductList data={latestProduct} title="Newest Arrival" />
      <ViewAllProductsButton />
      <DealCountDown />
      <IconBoxes />
    </>
  );
};

export default HomePage;
