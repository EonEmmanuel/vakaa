/**
 * Motion token constants — single source of truth for durations, easings, stagger
 * Mirrors CSS variables in globals.css for JS-side usage
 */

export const motionTokens = {
  duration: {
    instant: 100,
    fast: 150,
    base: 250,
    slow: 400,
    stagger: 40,
  },
  ease: {
    out: [0, 0, 0.2, 1],
    in: [0.4, 0, 1, 1],
    inOut: [0.4, 0, 0.2, 1],
    emphasized: [0.2, 0, 0, 1],
    spring: [0.32, 0.72, 0, 1],
  },
} as const;

export type MotionDuration = keyof typeof motionTokens.duration;
export type MotionEase = keyof typeof motionTokens.ease;

/**
 * Get duration in seconds (for Framer Motion)
 */
export function getDuration(key: MotionDuration): number {
  return motionTokens.duration[key] / 1000;
}

/**
 * Get easing array (for Framer Motion)
 */
export function getEase(key: MotionEase): number[] {
  return [...motionTokens.ease[key]] as number[];
}