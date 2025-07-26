"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from "../constants";

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

// Get all the products

export async function getAllProducts({
  page,
  query,
  limit = PAGE_SIZE,
  category,
}: {
  page: number;
  query: string;
  limit?: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
