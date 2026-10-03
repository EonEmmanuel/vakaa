'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Image, { type ImageProps } from 'next/image';
import { cn } from "@/lib/utils";

interface PremiumImageProps extends Omit<ImageProps, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style'> {
  containerClassName?: string;
  isProductImage?: boolean;
  aspectRatio?: 'portrait' | 'square' | 'video' | 'editorial' | 'custom';
  containerProps?: HTMLMotionProps<"div">;
}

function PremiumImage({
  className,
  containerClassName,
  isProductImage = false,
  aspectRatio = 'portrait',
  containerProps,
  alt,
  ...imageProps
}: PremiumImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const aspectRatios = {
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    video: 'aspect-[16/9]',
    editorial: 'aspect-[4/5]',
    custom: '',
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#F0EBE1]",
        aspectRatios[aspectRatio],
        containerClassName
      )}
      whileHover={isProductImage ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...containerProps}
    >
      <Image
        alt={alt || "VAKAA Creation"}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          !isLoaded && "opacity-0 scale-[1.02] blur-xs",
          isLoaded && "opacity-100 scale-100 blur-0",
          isProductImage && "group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none",
          className
        )}
        {...imageProps}
      />
    </motion.div>
  );
}

export { PremiumImage };
export default PremiumImage;