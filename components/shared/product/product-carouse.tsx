"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import AutoPlay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-[90%] md:w-full mb-12 relative"
      opts={{
        loop: true,
      }}
      plugins={[
        AutoPlay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={product.name}
                  height="0"
                  width="0"
                  sizes="100vw"
                  className="w-full h-[10rem] sm:h-auto  object-contain"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="hidden md:block bg-gray-900/50 text-2xl font-bold px-2 text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white/20" />
      </div>

      <div className="hidden md:block">
        <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white/20" />
      </div>
    </Carousel>
  );
};

export default ProductCarousel;
