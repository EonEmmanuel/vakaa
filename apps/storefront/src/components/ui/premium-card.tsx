'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps, type TargetAndTransition } from 'framer-motion';
import { cn } from "@/lib/utils";

interface PremiumCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm";
  isStatic?: boolean;
  variant?: "default" | "elevated" | "outlined";
}

function PremiumCard({
  className,
  size = "default",
  isStatic = false,
  children,
  variant = "default",
  ...props
}: PremiumCardProps) {
  const baseClasses = "group/card flex flex-col gap-6 overflow-hidden rounded-2xl bg-card py-6 text-sm text-card-foreground shadow-xs ring-1 ring-[#E7DED0]/80 data-[size=sm]:gap-4 data-[size=sm]:py-4";

  const variantClasses = {
    default: "",
    elevated: "shadow-[0_8px_24px_-6px_rgba(29,18,10,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(29,18,10,0.12)] ring-[#E7DED0]",
    outlined: "border border-[#E7DED0] hover:border-[#D4A43C]/50"
  };

  const hoverAnimation: TargetAndTransition | undefined = isStatic ? undefined : (
    variant === "elevated"
      ? { y: -6, transition: { type: "spring" as const, stiffness: 350, damping: 25 } }
      : { y: -2, transition: { type: "spring" as const, stiffness: 400, damping: 25 } }
  );

  return (
    <motion.div
      data-slot="card"
      data-size={size}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      initial={isStatic ? undefined : { opacity: 0, y: 16 }}
      animate={isStatic ? undefined : { opacity: 1, y: 0 }}
      exit={isStatic ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hoverAnimation}
      whileTap={isStatic ? undefined : { scale: 0.985 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { PremiumCard };
export default PremiumCard;
