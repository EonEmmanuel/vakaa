'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            {/* Main Image in Editorial 3:4 Portrait Ratio */}
            <div className="relative aspect-[3/4] bg-[#F0EBE1] dark:bg-[#1A120B] rounded-md overflow-hidden group cursor-crosshair border border-[#E7DED0]/60 dark:border-[#3A291C]/60 shadow-sm">
                <Image
                    src={images[currentIndex].source}
                    alt={`Product image ${currentIndex + 1}`}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={currentIndex === 0}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/60 hover:bg-white dark:hover:bg-black backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full size-9 text-[#1D120A] dark:text-[#F8F4EE]"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/60 hover:bg-white dark:hover:bg-black backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full size-9 text-[#1D120A] dark:text-[#F8F4EE]"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-[#FAF7F2] border border-white/10 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Grid in Matching 3:4 Proportions */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`aspect-[3/4] relative rounded-xs overflow-hidden transition-all duration-300 ${
                                index === currentIndex
                                    ? 'ring-2 ring-[#D4A43C] ring-offset-2 ring-offset-background scale-[1.02]'
                                    : 'border border-[#E7DED0] dark:border-[#3A291C] opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={image.preview}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover object-center"
                                sizes="20vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
