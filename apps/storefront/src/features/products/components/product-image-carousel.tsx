'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        <div className="space-y-4">
            {/* Main Image in Editorial Studio Pedestal (#F3EFE9) */}
            <div className="relative aspect-[3/4] bg-[#F3EFE9] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-[0_10px_30px_-15px_rgba(29,18,10,0.08)]">
                <Image
                    src={images[currentIndex].source}
                    alt={`Vue atelier ${currentIndex + 1}`}
                    fill
                    className="object-cover object-center transition-all duration-500 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={currentIndex === 0}
                />

                {/* Floating Dual-Color Nav Arrows (Matching ff98ca... reference: Left Ebony, Right Gold) */}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Image précédente"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-xl bg-[#1D120A] hover:bg-[#3A2418] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                        </button>
                        <button
                            type="button"
                            aria-label="Image suivante"
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-xl bg-[#D4A43C] hover:bg-[#BF9232] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                        </button>
                    </>
                )}

                {/* Counter Pill */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1D120A]/75 backdrop-blur-md text-[#FAF8F5] px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider tabular-nums">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip in Matching #F3EFE9 Pedestals */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((image, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => setCurrentIndex(index)}
                                className={`aspect-[3/4] relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#F3EFE9] transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'ring-2 ring-[#D4A43C] ring-offset-2 ring-offset-[#FAF8F5] scale-[1.02]'
                                        : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                                }`}
                            >
                                <Image
                                    src={image.preview}
                                    alt={`Miniature ${index + 1}`}
                                    fill
                                    className="object-cover object-center p-1"
                                    sizes="20vw"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
