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
            className={`mx-auto flex h-16 w-full max-w-[1720px] items-center justify-between rounded-full pl-3 sm:pl-4 lg:pl-5 pr-2 pointer-events-auto relative transition-[background-color,box-shadow,border-color] duration-300 ${
                scrolled
                    ? 'bg-[#fbfaf7]/95 dark:bg-[#1c1b19]/95 shadow-tile ring-1 ring-[#e2ddd2]/80 dark:ring-[#2e2c28] backdrop-blur-xl'
                    : 'bg-[#fbfaf7]/70 dark:bg-[#1c1b19]/70 ring-1 ring-transparent backdrop-blur-md'
            }`}
        >
            {children}
        </motion.div>
    );
}
