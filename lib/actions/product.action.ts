"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCT_LIMIT } from "../constants";

import { convertToPlainObject } from "../utils";

// Get Latest Product in the database
export async function getLatestProduct() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

// GET single Product by it slug

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug: slug } });
}
