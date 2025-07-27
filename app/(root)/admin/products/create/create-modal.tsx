"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { PRODUCT_DEFAULT_VALUES } from "@/lib/constants";
import { useToast } from "@/lib/hooks/useToast";
import { insertProductSchema, updateProductsSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const CreateModal = ({
  type,
  product,
  productId,
}: {
  type: string;
  product?: Product;
  productId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { success, warning } = useToast();

  const schema = type === "Update" ? updateProductsSchema : insertProductSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      product && type === "Update" ? product : PRODUCT_DEFAULT_VALUES,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    //For create
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        warning(`Failed to create:${res.message}`);
      } else {
        success(res.message);
        form.reset(PRODUCT_DEFAULT_VALUES); //reset form
      }
    }

    //For Update

    if (type === "Update") {
      if (!productId) {
        warning("There's no product ID. Please insert one");
        return;
      }
      const res = await updateProduct({ ...values, id: productId });
      if (!res.success) {
        warning(`Failed to update:${res.message}`);
      } else {
        success(res.message);
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");
  return (
    <>
      {/* Button outside the modal */}
      {type === "Create" ? (
        <Button onClick={() => setOpen(true)} className="cursor-pointer mx-2">
          Create Product
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            setOpen(true);
          }}
          className="cursor-pointer mx-2"
        >
          Edit
        </Button>
      )}

      {/* Modal Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="custom-dialog-content max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="mb-5">Create Product</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-8"
              id="product-form"
              method="POST"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "name"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative md:mb-8">
                          <Input
                            placeholder="Enter product name"
                            {...field}
                            className="mb-4"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "slug"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Enter Slug" {...field} />
                          <Button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                            onClick={() => {
                              form.setValue(
                                "slug",
                                slugify(form.getValues("name"), { lower: true })
                              );
                            }}
                          >
                            Generate Slug
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "category"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Category of the Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "brand"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Brand of the Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-5 md:flex-row">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "price"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Price of the Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "stock"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the Stock of the Product"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="upload-field flex flex-col gap-5 md:flex-row">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel>Images</FormLabel>
                      <Card>
                        <CardContent className="space-y-2 mt-2 mix-h-48">
                          <div className="flex-start space-x-2">
                            {images.map((image: string) => (
                              <Image
                                key={image}
                                src={image}
                                alt="Product Image"
                                className="w-20 h-20 object-cover object-center rounded-sm"
                                width={100}
                                height={100}
                              />
                            ))}
                            <FormControl>
                              <UploadButton
                                endpoint="imageUploader"
                                onClientUploadComplete={(
                                  res: { url: string }[]
                                ) => {
                                  form.setValue("images", [
                                    ...images,
                                    res[0].url,
                                  ]);
                                }}
                                onUploadError={(error: Error) => {
                                  warning(`${error.message}`);
                                }}
                              />
                            </FormControl>
                          </div>
                        </CardContent>
                      </Card>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="upload-field">
                {/* isFeatured */}
                Featured Product
                <Card>
                  <CardContent className="space-y-2 mt-2">
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="space-x-2 flex items-center">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Is Featured?</FormLabel>
                        </FormItem>
                      )}
                    />

                    {isFeatured && banner && (
                      <Image
                        src={banner}
                        alt="Banner Image"
                        className="w-full object-cover object-center rounded-sm"
                        width={1920}
                        height={680}
                      />
                    )}

                    {isFeatured && !banner && (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          form.setValue("banner", res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          warning(`${error.message}`);
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "description"
                    >;
                  }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product descriptions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          {/* <ProductForm type={type} /> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  if (type === "Create") {
                    form.reset(PRODUCT_DEFAULT_VALUES);
                  } // reset form fields
                }}
              >
                Cancel
              </Button>
            </DialogClose>

            {
              <Button
                type="submit"
                form="product-form"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    {type === "Create" ? "Creating..." : "Editing..."}
                  </span>
                ) : (
                  <span>{type === "Create" ? "Create Product" : "Edit"}</span>
                )}
              </Button>
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateModal;
