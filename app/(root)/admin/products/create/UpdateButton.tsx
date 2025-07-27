import { getProductById } from "@/lib/actions/product.action";
import CreateModal from "./create-modal";

const UpdateButton = async ({ id }: { id: string }) => {
  const product = await getProductById(id);
  if (!product) throw new Error("No product");
  return <CreateModal type="Update" product={product} productId={product.id} />;
};

export default UpdateButton;
