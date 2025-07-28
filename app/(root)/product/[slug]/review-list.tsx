"use client";

import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarCheck2, User } from "lucide-react";
import Image from "next/image";
import { formatDateandTime } from "@/lib/utils";
import RatingStars from "@/components/shared/product/ratings-stars";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  //This will reload the reviews after created or updated
  const reload = async () => {
    const res = await getReviews({ productId });
    setReviews([...res.data]);
  };
  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);
  return (
    <div className="space-y-4 mx-4">
      {reviews.length === 0 && <div>No Reviews yet.</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          {" "}
          Please
          <Link
            className="text-blue-700 px-2"
            href={`/signIn?callbackUrl=/product/${productSlug}`}
          >
            Sign In
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Reviews here */}

        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex flex-col  sm:flex-row items-center gap-4">
                  {review.user?.image ? (
                    <Image
                      src={review.user.image}
                      alt="User Image"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="mr-1" />
                  )}
                  {review.user ? review.user.name : "User"}
                  <span className="flex items-center">
                    <CalendarCheck2 className="mr-1 w-4 h-4" />

                    {formatDateandTime(review.createdAt).dateTime}
                  </span>
                  <RatingStars value={review.rating} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
