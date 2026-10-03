import type { Variants } from 'framer-motion';

// Shared animation presets for uniform motion throughout the VAKAA storefront
export const variants = {
  // Entrance animations
  entrance: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Entrance from left
  entranceLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Entrance from right
  entranceRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Staggered entrance for lists
  staggerContainer: {
    staggerChildren: 0.08,
    delayChildren: 0.1
  },

  // Hover animations
  hover: {
    scale: 1.04,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 }
  },

  // Hover lift (for cards)
  hoverLift: {
    y: -4,
    transition: { type: "spring" as const, stiffness: 350, damping: 25 }
  },

  // Press/tap animations
  press: {
    scale: 0.96,
    transition: { type: "spring" as const, stiffness: 500, damping: 20 }
  },

  // Tap feedback
  tap: {
    scale: 0.98,
    transition: { type: "spring" as const, stiffness: 500, damping: 20 }
  },

  // Exit animations
  exit: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } }
  },

  // Exit fade
  exitFade: {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } }
  }
};

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] } }
};

// Motion variants for image hover effects
export const imageVariants: Variants = {
  default: { scale: 1 },
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 20 } },
  tap: { scale: 0.98, transition: { type: "spring", stiffness: 500, damping: 20 } }
};

// Motion variants for interactive buttons
export const buttonVariants: Variants = {
  default: { scale: 1 },
  hover: { scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 20 } },
  press: { scale: 0.97, transition: { type: "spring", stiffness: 500, damping: 20 } },
  focus: { scale: 1.01, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

// Motion variants for skeleton loaders
export const skeletonVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.95, 0.5],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
  }
};