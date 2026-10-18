'use client';

import { useRef } from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
    useReducedMotion,
    wrap,
} from 'framer-motion';

interface RollingTextMarqueeProps {
    items?: string[];
    baseSpeed?: number;
    className?: string;
}

const DEFAULT_VAKAA_ITEMS = [
    'Paille de Bolgatanga',
    'Cuir pleine fleur',
    'Laiton massif brossé',
    'Teintures végétales',
    'Façonné à la main',
    'Expédié sous 48h',
];

export function RollingTextMarquee({
    items = DEFAULT_VAKAA_ITEMS,
    baseSpeed = 1.8,
    className = '',
}: RollingTextMarqueeProps) {
    const isReducedMotion = useReducedMotion();
    const x = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-4, 0, 4], { clamp: false });
    const direction = useRef(1);
    const xTransform = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

    useAnimationFrame((_time, delta) => {
        if (isReducedMotion) return;
        const factor = velocityFactor.get();
        if (factor < 0) direction.current = -1;
        else if (factor > 0) direction.current = 1;
        x.set(x.get() - direction.current * (baseSpeed + Math.abs(factor) * baseSpeed) * (delta / 1000));
    });

    const content = (
        <div className="flex shrink-0 items-center">
            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    <span className="px-4 sm:px-8 font-display text-xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.02em] text-[#1c1b18] dark:text-[#fbfaf7] whitespace-nowrap">
                        {item}
                    </span>
                    <span aria-hidden={true} className="size-2 sm:size-2.5 shrink-0 rounded-full bg-[#D4A43C]" />
                </span>
            ))}
        </div>
    );

    return (
        <div 
            className={`w-full overflow-hidden border-y border-[#e2ddd2]/40 dark:border-white/5 bg-[#f2efe9] dark:bg-[#151413] py-4 sm:py-8 select-none ${className}`}
            aria-label={items.join(', ')}
        >
            <motion.div 
                aria-hidden={true} 
                className="flex w-max whitespace-nowrap will-change-transform" 
                style={{ x: xTransform }}
            >
                {content}
                {content}
            </motion.div>
        </div>
    );
}
