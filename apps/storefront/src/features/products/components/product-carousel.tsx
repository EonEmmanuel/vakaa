'use client';

import {ProductCard} from "@/features/products/components/product-card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {FragmentOf} from "@/platform/vendure/graphql";
import {ProductCardFragment} from '@/features/products/graphql';
import {useId} from "react";
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from "lucide-react";

interface ProductCarouselClientProps {
    title: string;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
}

export function ProductCarousel({title, products}: ProductCarouselClientProps) {
    const id = useId();

    return (
        <section className="py-14 sm:py-20 bg-[#f2efe9] transition-colors border-t border-[#e2ddd2]">
            <div className="vakaa-container">
                {/* Centered Editorial Header */}
                <div className="text-center space-y-2 mb-10 sm:mb-14 max-w-2xl mx-auto">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#D4A43C] flex items-center justify-center gap-2">
                        <span>—</span>
                        <span>{title ? title : 'Related Products'}</span>
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1b18] leading-tight">
                        Explore <span className="text-[#1c1b18]">Related Products</span>
                    </h2>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full relative"
                >
                    <CarouselContent className="-ml-3 md:-ml-5">
                        {products.map((product, i) => (
                            <CarouselItem key={id + i}
                                          className="pl-3 md:pl-5 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <ProductCard product={product}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 border border-[#e2ddd2] hover:bg-[#1D120A] hover:text-white transition-colors cursor-pointer"/>
                    <CarouselNext className="hidden md:flex -right-4 bg-white/90 border border-[#e2ddd2] hover:bg-[#1D120A] hover:text-white transition-colors cursor-pointer"/>
                </Carousel>
            </div>
        </section>
    );
}
