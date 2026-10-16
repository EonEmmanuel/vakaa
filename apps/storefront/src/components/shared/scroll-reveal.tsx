'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
    as?: 'div' | 'section' | 'article' | 'p' | 'span';
    delay?: number;
    y?: number;
    className?: string;
    children?: React.ReactNode;
}

export function ScrollReveal({
    as: Component = 'div',
    delay = 0,
    y = 28,
    className = '',
    children,
    ...props
}: ScrollRevealProps) {
    const MotionComponent = motion[Component] || motion.div;
    return (
        <MotionComponent
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const }}
            {...props}
        >
            {children}
        </MotionComponent>
    );
}
