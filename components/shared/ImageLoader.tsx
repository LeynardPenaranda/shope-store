"use client";

import Image from "next/image";
import { useState } from "react";
import SpinnerMini from "./SpinnerMini";

interface ImageLoaderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

const ImageLoader = ({
  src,
  alt,
  width,
  height,
  priority,
}: ImageLoaderProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="relative w-fit h-fit">
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <SpinnerMini />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        onLoad={() => setIsImageLoading(false)}
        className={`transition-opacity duration-300 ${
          isImageLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

export default ImageLoader;
