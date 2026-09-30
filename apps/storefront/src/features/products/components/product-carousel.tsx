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
        <section className="py-14 sm:py-20 bg-[#FAF8F5] transition-colors border-t border-[#E7DED0]/60">
            <div className="vakaa-container">
                {/* Header matching ff98ca... reference */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
                    <div className="space-y-1">
                        <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#A66B2D] flex items-center gap-2">
                            <span>—</span>
                            <span>Créations d’Exception</span>
                        </span>
                        <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1D120A] leading-tight">
                            {title || 'Explorez les Créations Similaires'}
                        </h2>
                    </div>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A66B2D] hover:text-[#1D120A] transition-colors cursor-pointer"
                    >
                        <span>Tout Voir</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
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
                    <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 dark:bg-[#20150D]/90 border border-[#E7DED0] dark:border-[#3A291C] hover:bg-[#D4A43C] hover:text-[#1D120A] transition-colors"/>
                    <CarouselNext className="hidden md:flex -right-4 bg-white/90 dark:bg-[#20150D]/90 border border-[#E7DED0] dark:border-[#3A291C] hover:bg-[#D4A43C] hover:text-[#1D120A] transition-colors"/>
                </Carousel>
            </div>
        </section>
    );
}
