import { requireAdmin } from "@/lib/auth-guard";

const ProductPage = async () => {
  await requireAdmin();

  return <>Product</>;
};

export default ProductPage;
