"use server";

import z from "zod";
import { insertReviewsSchema } from "../validator";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// Create & update reviews

export async function createUpdateReview(
  data: z.infer<typeof insertReviewsSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("user not authenticated");

    // Validated and Store the Review
    const Review = insertReviewsSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get product that is being reviewed
    const product = await prisma.product.findFirst({
      where: { id: Review.productId },
    });

    if (!product) throw new Error("Product not found");

    // Check if user already reviewed the product
    const reviewExist = await prisma.review.findFirst({
      where: { productId: Review.productId, userId: Review.userId },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExist) {
        //Update the Review
        await tx.review.update({
          where: { id: reviewExist.id },
          data: {
            title: Review.title,
            description: Review.description,
            rating: Review.rating,
          },
        });
      } else {
        //Create the Review

        await tx.review.create({
          data: Review,
        });
      }

      // Get the average ratings

      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: Review.productId },
      });

      //Get the number of reviews

      const numReviews = await tx.review.count({
        where: { productId: Review.productId },
      });

      //Update the rating and NumReviews in the product table
      await tx.product.update({
        where: { id: Review.productId },
        data: { rating: averageRating._avg.rating || 0, numReviews },
      });
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: "Review Updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all Reviews

export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId: productId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

//Get a review written by the current user

export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();
  if (!session) throw new Error("User not authenticated");
  return await prisma.review.findFirst({
    where: { productId: productId, userId: session?.user?.id },
  });
}
