import { useEffect, useRef, type RefObject } from 'react';
import { useMotionValue } from 'framer-motion';
import gsap from 'gsap';

/**
 * Custom hook for hover animations with spring physics
 * @returns {Object} Motion values and event handlers for hover effects
 */
export function useHoverSpring() {
  const scale = useMotionValue(1);
  const y = useMotionValue(0);

  const hoverBindings = {
    whileHover: { scale: 1.04, y: -4 },
    whileTap: { scale: 0.96, y: 0 }
  };

  return { scale, y, ...hoverBindings };
}

/**
 * Custom hook for scroll-based animations
 * @param {Function} callback - Function to call when element enters viewport
 * @param {Object} options - IntersectionObserver options
 */
export function useScrollAnimation(callback: (entry: IntersectionObserverEntry) => void, options: IntersectionObserverInit = {}) {
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
 * Custom hook for staggered animations in lists
 * @param {number} index - Index of the element in the list
 * @param {number} delay - Base delay between elements
 * @returns {Object} Animation variants with stagger applied
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
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
}

/**
 * Custom hook for pulse animations (useful for CTAs or highlights)
 * @returns {Object} Animation variants for pulsing effect
 */
export function usePulseVariant() {
  return {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
}

/**
 * Custom hook for float animation (subtle up/down motion)
 * @returns {Object} Animation variants for floating effect
 */
export function useFloatVariant() {
  return {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
}

/**
 * Custom hook for shake animation (useful for form errors)
 * @returns {Object} Animation variants for shaking effect
 */
export function useShakeVariant() {
  return {
    initial: { x: 0 },
    animate: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };
}

/* ═══════════════════════════════════════════════════════════════════
   GSAP LUXURY ANIMATION HOOKS (Scoped, SSR-safe & Memory-leak proof)
   ═══════════════════════════════════════════════════════════════════ */

interface ContinuousRotationOptions {
  duration?: number;
  clockwise?: boolean;
}

/**
 * Hook for ultra-smooth continuous rotation (e.g. geometric watermarks, atelier seals)
 */
export function useGsapContinuousRotation<T extends HTMLElement | SVGElement>(
  targetRef: RefObject<T | null>,
  options: ContinuousRotationOptions = {}
) {
  const { duration = 90, clockwise = true } = options;

  useEffect(() => {
    if (!targetRef.current || typeof window === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

interface MagneticOptions {
  strength?: number;
}

/**
 * Hook for subtle magnetic physics attraction on buttons / interactive badges
 */
export function useGsapMagnetic<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: MagneticOptions = {}
) {
  const { strength = 0.25 } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
  }, [targetRef, strength]);
}

interface FloatingOptions {
  y?: number;
  duration?: number;
}

/**
 * Hook for delicate levitation floating motion
 */
export function useGsapFloating<T extends HTMLElement | SVGElement>(
  targetRef: RefObject<T | null>,
  options: FloatingOptions = {}
) {
  const { y = 8, duration = 3.5 } = options;

  useEffect(() => {
    if (!targetRef.current || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

interface TiltOptions {
  maxTilt?: number;
  scale?: number;
}

/**
 * Hook for futuristic 3D perspective tilt on cursor movement
 */
export function useGsapTilt<T extends HTMLElement>(
  targetRef: RefObject<T | null>,
  options: TiltOptions = {}
) {
  const { maxTilt = 7, scale = 1.02 } = options;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
  }, [targetRef, maxTilt, scale]);
}