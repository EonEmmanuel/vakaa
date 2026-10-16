/**
 * Framer Motion variant library — reusable animation patterns
 * Uses motion tokens for consistent timing and easing
 */

import { Variants } from 'framer-motion';
import { getDuration } from './tokens';

// Type helper for cubic-bezier easing
type CubicBezier = [number, number, number, number];

const easeSpring: CubicBezier = [0.32, 0.72, 0, 1];
const easeOut: CubicBezier = [0, 0, 0.2, 1];
const easeIn: CubicBezier = [0.4, 0, 1, 1];
const easeInOut: CubicBezier = [0.4, 0, 0.2, 1];

/**
 * Standard fade-up entrance
 */
export const fadeUp = (delay = 0): Variants => ({
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getDuration('slow'),
      ease: easeSpring,
      delay,
    },
  },
});

/**
 * Staggered children container
 */
export const staggerContainer = (stagger = getDuration('stagger')): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

/**
 * Card entrance with index-based stagger
 */
export const cardEntrance = (index: number): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: index * getDuration('stagger'),
      duration: getDuration('slow'),
      ease: easeSpring,
    },
  },
});

/**
 * Accordion open/close
 */
export const accordionVariants: Variants = {
  closed: { height: 0, opacity: 0 },
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: getDuration('base'),
      ease: easeSpring,
    },
  },
};

/**
 * Scale-in for modals, dialogs, popovers
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getDuration('base'),
      ease: easeSpring,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: getDuration('fast'),
      ease: easeIn,
    },
  },
};

/**
 * Slide-in from side (for drawers, sheets)
 */
export const slideIn = (direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom'): Variants => {
  const variants: Record<string, Variants> = {
    left: {
      initial: { opacity: 0, x: -24 },
      animate: { opacity: 1, x: 0, transition: { duration: getDuration('slow'), ease: easeSpring } },
      exit: { opacity: 0, x: -24, transition: { duration: getDuration('fast'), ease: easeIn } },
    },
    right: {
      initial: { opacity: 0, x: 24 },
      animate: { opacity: 1, x: 0, transition: { duration: getDuration('slow'), ease: easeSpring } },
      exit: { opacity: 0, x: 24, transition: { duration: getDuration('fast'), ease: easeIn } },
    },
    top: {
      initial: { opacity: 0, y: -24 },
      animate: { opacity: 1, y: 0, transition: { duration: getDuration('slow'), ease: easeSpring } },
      exit: { opacity: 0, y: -24, transition: { duration: getDuration('fast'), ease: easeIn } },
    },
    bottom: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0, transition: { duration: getDuration('slow'), ease: easeSpring } },
      exit: { opacity: 0, y: 24, transition: { duration: getDuration('fast'), ease: easeIn } },
    },
  };
  return variants[direction];
};

/**
 * Button hover/tap micro-interactions
 */
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  tap: { scale: 0.98, transition: { type: 'spring', stiffness: 500, damping: 20 } },
  focus: { scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 20 } },
};

/**
 * Image reveal with hover scale
 */
export const imageVariants: Variants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: getDuration('slow'),
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

/**
 * Skeleton shimmer loading
 */
export const skeletonVariants: Variants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Page-level entrance
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getDuration('slow'),
      ease: easeSpring,
      staggerChildren: getDuration('stagger'),
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: getDuration('fast'),
      ease: easeIn,
    },
  },
};

/**
 * List item stagger (for trust bar, grids, etc.)
 */
export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: getDuration('base'),
      ease: easeSpring,
    },
  },
};

/**
 * Tab/panel content transition
 */
export const tabVariants: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: getDuration('base'),
      ease: easeSpring,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: {
      duration: getDuration('fast'),
      ease: easeIn,
    },
  },
};

/**
 * Toast/notification entrance
 */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: getDuration('base'),
      ease: easeSpring,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.95,
    transition: {
      duration: getDuration('fast'),
      ease: easeIn,
    },
  },
};

/**
 * Carousel slide
 */
export const carouselVariants: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { x: -20, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};