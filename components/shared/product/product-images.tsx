"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  console.log(images);
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product images"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />

      <div className="flex ">
        {images.map((image, index) => (
          <div key={image} className="border border-gray-200">
            <Image
              src={image}
              alt="image"
              width={100}
              height={100}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer ${
                current === index ? `border border-black` : ``
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
