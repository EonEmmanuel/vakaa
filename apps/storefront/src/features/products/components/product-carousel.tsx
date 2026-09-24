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
        <section className="py-16 md:py-24 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-8 md:mb-12">
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase">
                        {title}
                    </h2>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#1D120A] dark:text-[#D4A43C] hover:text-[#D4A43C] dark:hover:text-[#BF9232] transition-colors"
                    >
                        <span>VIEW ALL</span>
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
