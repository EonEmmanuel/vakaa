'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingIslandBarProps {
    children: React.ReactNode;
}

export function FloatingIslandBar({ children }: FloatingIslandBarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 16);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
            className={`mx-auto flex h-16 w-full max-w-[1720px] items-center justify-between rounded-full pl-2.5 sm:pl-3 lg:pl-4 pr-1.5 sm:pr-2 pointer-events-auto relative transition-[background-color,box-shadow,border-color] duration-300 ${
                scrolled
                    ? 'bg-[#fbfaf7]/85 dark:bg-[#1c1b19]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 dark:border-white/15 ring-1 ring-black/10 dark:ring-white/10 shadow-[0_16px_36px_-12px_rgba(28,27,24,0.18)] dark:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.6)]'
                    : 'bg-[#fbfaf7]/65 dark:bg-[#1c1b19]/65 backdrop-blur-xl backdrop-saturate-150 border border-white/70 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 shadow-glass'
            }`}
        >
            {children}
        </motion.div>
    );
}
