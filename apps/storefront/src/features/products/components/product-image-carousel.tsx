'use client';

import { useState, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, normalizeAssetUrl } from "@/lib/utils";
import { useGsapMagnetic } from '@/lib/motion/gsap-hooks';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

// Motion variants for image carousel
const carouselVariants: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { x: -20, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};

const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    press: { scale: 0.95, transition: { type: 'spring', stiffness: 500, damping: 20 } }
};

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const prevButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    // Apply magnetic effect to navigation buttons
    useGsapMagnetic(prevButtonRef, { strength: 0.1, disableOnTouch: true });
    useGsapMagnetic(nextButtonRef, { strength: 0.1, disableOnTouch: true });

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
            </div>
        );
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={carouselVariants}
        >
            <div className="space-y-4">
                {/* Main Image in Editorial Studio Pedestal */}
                <div className="relative aspect-[3/4] bg-[#fbfaf7] border border-[#e2ddd2] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-sm">
                    <Image
                        src={normalizeAssetUrl(images[currentIndex].source || images[currentIndex].preview) || '/images/bags/baguette-indigo-savane-1.jpg'}
                        alt={`Vue atelier ${currentIndex + 1}`}
                        fill
                        className="object-cover object-center transition-all duration-500 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={currentIndex === 0}
                    />

                    {/* Floating Nav Arrows with tactile spring physics + GSAP magnetic */}
                    {images.length > 1 && (
                        <>
                            <motion.button
                                ref={prevButtonRef}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                aria-label="Image précédente"
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-xl bg-[#1c1b18] hover:bg-[#3A2418] text-white flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer z-10"
                                onClick={goToPrevious}
                            >
                                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                            </motion.button>
                            <motion.button
                                ref={nextButtonRef}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                aria-label="Image suivante"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-xl bg-[#1c1b18] hover:bg-[#3A2418] text-white flex items-center justify-center shadow-md transition-colors duration-200 cursor-pointer z-10"
                                onClick={goToNext}
                            >
                                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                            </motion.button>
                        </>
                    )}

                    {/* Counter Pill */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1c1b18]/80 backdrop-blur-md text-[#fbfaf7] px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider tabular-nums font-mono">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Strip in Matching Pedestals */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {images.map((image, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <motion.button
                                    key={image.id}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="press"
                                    variants={{
                                        initial: { scale: 1 },
                                        hover: { scale: 1.02 },
                                        press: { scale: 0.98 }
                                    }}
                                    className={cn(
                                        "aspect-[3/4] relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#fbfaf7] border border-[#e2ddd2] transition-all duration-200 cursor-pointer",
                                        isActive
                                            ? 'ring-2 ring-[#D4A43C] ring-offset-2 ring-offset-[#f2efe9]'
                                            : 'opacity-70 hover:opacity-100'
                                    )}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <Image
                                        src={normalizeAssetUrl(image.preview || image.source) || '/images/bags/baguette-indigo-savane-1.jpg'}
                                        alt={`Miniature ${index + 1}`}
                                        fill
                                        className="object-cover object-center p-1"
                                        sizes="20vw"
                                    />
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}