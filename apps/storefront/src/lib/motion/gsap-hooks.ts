/**
 * GSAP Luxury Animation Hooks — Refined from animations/hooks.ts
 * SSR-safe, prefers-reduced-motion aware, gsap.context() cleanup
 * Use for premium micro-interactions: magnetic, tilt, floating, continuous rotation
 */

'use client';

import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if device is touch/coarse pointer
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Hook for subtle magnetic physics attraction on buttons / interactive badges
 * @param targetRef - Ref to the element
 * @param options.strength - Magnetic strength (0-1), default 0.25
 * @param options.disableOnTouch - Disable on touch devices, default true
 */
export function useGsapMagnetic<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: { strength?: number; disableOnTouch?: boolean; enabled?: boolean } = {}
) {
  const { strength = 0.25, disableOnTouch = true, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    const el = targetRef.current;
    if (!el || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;
    if (disableOnTouch && isTouchDevice()) return;

    let boundRect: DOMRect | null = null;

    const handleMouseEnter = () => {
      boundRect = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundRect) boundRect = el.getBoundingClientRect();
      const centerX = boundRect.left + boundRect.width / 2;
      const centerY = boundRect.top + boundRect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      boundRect = null;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [targetRef, strength, disableOnTouch]);
}

/**
 * Hook for futuristic 3D perspective tilt on cursor movement
 * @param targetRef - Ref to the element
 * @param options.maxTilt - Max rotation in degrees, default 7
 * @param options.scale - Scale on hover, default 1.02
 * @param options.disableOnTouch - Disable on touch devices, default true
 */
export function useGsapTilt<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: { maxTilt?: number; scale?: number; disableOnTouch?: boolean } = {}
) {
  const { maxTilt = 7, scale = 1.02, disableOnTouch = true } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;
    if (disableOnTouch && isTouchDevice()) return;

    let boundRect: DOMRect | null = null;

    const handleMouseEnter = () => {
      boundRect = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!boundRect) boundRect = el.getBoundingClientRect();
      const xPct = (e.clientX - boundRect.left) / boundRect.width - 0.5;
      const yPct = (e.clientY - boundRect.top) / boundRect.height - 0.5;

      const rotateY = xPct * maxTilt * 2;
      const rotateX = -yPct * maxTilt * 2;

      gsap.to(el, {
        rotateX,
        rotateY,
        scale,
        transformPerspective: 1200,
        transformOrigin: '50% 50%',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      boundRect = null;
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [targetRef, maxTilt, scale, disableOnTouch]);
}

/**
 * Hook for delicate levitation floating motion (yoyo)
 * @param targetRef - Ref to the element
 * @param options.y - Float distance in pixels, default 8
 * @param options.duration - Duration in seconds, default 3.5
 */
export function useGsapFloating<T extends HTMLElement | SVGElement>(
  targetRef: RefObject<T | null>,
  options: { y?: number; duration?: number } = {}
) {
  const { y = 8, duration = 3.5 } = options;

  useEffect(() => {
    if (!targetRef.current || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(targetRef.current, {
        y,
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, [targetRef, y, duration]);
}

/**
 * Hook for ultra-smooth continuous rotation (e.g. geometric watermarks, atelier seals)
 * @param targetRef - Ref to the element
 * @param options.duration - Duration in seconds for full rotation, default 90
 * @param options.clockwise - Rotation direction, default true
 */
export function useGsapContinuousRotation<T extends HTMLElement | SVGElement>(
  targetRef: RefObject<T | null>,
  options: { duration?: number; clockwise?: boolean } = {}
) {
  const { duration = 90, clockwise = true } = options;

  useEffect(() => {
    if (!targetRef.current || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(targetRef.current, {
        rotation: clockwise ? 360 : -360,
        duration,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    });

    return () => ctx.revert();
  }, [targetRef, duration, clockwise]);
}

/**
 * Hook for hover animations with spring physics (Framer Motion style)
 * Returns motion values and event handlers
 */
export function useHoverSpring() {
  // This is a Framer Motion utility - keeping for compatibility
  return {
    whileHover: { scale: 1.04, y: -4 },
    whileTap: { scale: 0.96, y: 0 },
  };
}

/**
 * Hook for scroll-based animations
 * @param callback - Function to call when element enters viewport
 * @param options - IntersectionObserver options
 */
export function useScrollAnimation(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, options);

    return () => observer.disconnect();
  }, [callback, options]);
}

/**
 * Hook for staggered animations in lists
 * @param index - Index of the element in the list
 * @param delay - Base delay between elements
 * @returns Framer Motion variants with stagger applied
 */
export function useStaggerVariant(index: number, delay: number = 0.08) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * delay,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
}

/**
 * Hook for pulse animations (useful for CTAs or highlights)
 * @returns Framer Motion variants for pulsing effect
 */
export function usePulseVariant() {
  return {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };
}

/**
 * Hook for shake animation (useful for form errors)
 * @returns Framer Motion variants for shaking effect
 */
export function useShakeVariant() {
  return {
    initial: { x: 0 },
    animate: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };
}