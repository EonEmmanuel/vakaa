/**
 * Reduced Motion Utilities — Centralized prefers-reduced-motion handling
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect prefers-reduced-motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Get reduced motion safe transition config
 * Returns minimal transition if reduced motion is preferred
 */
export function getReducedMotionTransition(
  prefersReduced: boolean,
  normalTransition: Record<string, unknown>
): Record<string, unknown> {
  if (prefersReduced) {
    return { duration: 0.01, ...normalTransition };
  }
  return normalTransition;
}

/**
 * Reduced motion aware Framer Motion variants wrapper
 * Wraps variants to respect prefers-reduced-motion
 */
export function withReducedMotion<Variants extends Record<string, Record<string, unknown>>>(
  variants: Variants,
  prefersReduced: boolean
): Variants {
  if (!prefersReduced) return variants;

  const reduced: Record<string, Record<string, unknown>> = {};
  for (const [key, variant] of Object.entries(variants)) {
    reduced[key] = {
      ...variant,
      transition: { duration: 0.01, ...(variant.transition as Record<string, unknown> || {}) },
    };
  }
  return reduced as Variants;
}

/**
 * CSS class for reduced motion - can be applied globally
 */
export const REDUCED_MOTION_CLASS = 'motion-reduce';

/**
 * Check if reduced motion is currently preferred (non-hook version for SSR)
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}