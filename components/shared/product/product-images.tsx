"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 flex items-center justify-center mt-10">
        <Image
          src={images[current]}
          alt="product images"
          width={300}
          height={300}
          className="min-h-[300px] object-cover object-center"
        />
      </div>
      <div className="flex ">
        {images.map((image, index) => (
          <div
            key={image}
            className={`${
              current === index ? `border border-black` : ``
            } max-h-[6.4rem] overflow-hidden`}
          >
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer `}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
