import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

export const currency = z
  .string()
  .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
    message: "Price must be a number with up to two decimal places",
  });

//Schema for inserting products

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least three characters"),
  slug: z.string().min(3, "Slug must be at least three characters"),
  category: z.string().min(3, "Category must be at least three characters"),
  brand: z.string().min(3, "Brand must be at least three characters"),
  description: z
    .string()
    .min(3, "Description must be at least three characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//Schema for signing user in

export const signInFormSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "password must be at least 12 Characters Long"),
});

//Schema for Signing Up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(6, "password must be at least 12 Characters Long"),
    confirmPassword: z
      .string()
      .min(6, "confim password must be at least 12 Characters Long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

// Cart Schemas

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertcartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

//Schema for Shipping Address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least three Characters"),
  streetAddress: z.string().min(3, "Address must be at least three Characters"),
  City: z.string().min(3, "City must be at least three Characters"),
  postalCode: z
    .string()
    .min(3, "Postal Code must be at least three Characters"),
  country: z.string().min(3, "Country must be at least three Characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//Schema for Payment Method

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid Payment method",
  });

//Schema for insert Order

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  qty: z.number(),
  price: currency,
  name: z.string(),
  slug: z.string(),
  image: z.string(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});
