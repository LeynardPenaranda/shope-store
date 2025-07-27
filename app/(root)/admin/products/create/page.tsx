import ProductForm from "./product-form";

export const metadata = {
  title: "Create Product",
};
const CreateProductPage = () => {
  return (
    <div className="w-full">
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </div>
  );
};

export default CreateProductPage;
