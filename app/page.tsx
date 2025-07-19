import ProductList from "@/components/shared/product/productList";

import { getLatestProduct } from "@/lib/actions/product.action";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Home / ${APP_NAME}`,
};

const HomePage = async () => {
  const latestProduct = await getLatestProduct();

  return (
    <>
      <ProductList data={latestProduct} title="Newest Arrival" />
    </>
  );
};

export default HomePage;
