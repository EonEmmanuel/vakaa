'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from "@/lib/utils";

const skeletonVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.95, 0.5],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface PremiumSkeletonProps extends React.ComponentProps<"div"> {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

function PremiumSkeleton({
  className,
  width,
  height,
  borderRadius,
  onDrag,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragExit,
  onDragLeave,
  onDragOver,
  onDrop,
  onAnimationStart,
  onAnimationEnd,
  onAnimationIteration,
  onTransitionEnd,
  style,
  ...props
}: PremiumSkeletonProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-md bg-[#EFE8DD]/70 dark:bg-[#20150D]/70",
        className
      )}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...(borderRadius !== undefined ? { borderRadius } : {}),
        ...style,
      }}
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      {...props}
      // Note: We're not spreading animation and drag event handlers to avoid type conflicts
      // with framer-motion's animation and drag handling. If such functionality is needed,
      // it should be implemented differently using framer-motion's animation and drag props.
    >
      <div className="sr-only">Loading...</div>
    </motion.div>
  );
}

export { PremiumSkeleton };
export default PremiumSkeleton;