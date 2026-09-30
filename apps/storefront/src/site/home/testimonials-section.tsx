import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {Star, CheckCircle2, Quote} from 'lucide-react';

export async function TestimonialsSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const reviews = [
        {
            quote: t('testimonials.quote1'),
            author: t('testimonials.author1'),
            initials: 'AK',
            location: t('testimonials.location1'),
            product: t('testimonials.product1'),
        },
        {
            quote: t('testimonials.quote2'),
            author: t('testimonials.author2'),
            initials: 'ER',
            location: t('testimonials.location2'),
            product: t('testimonials.product2'),
        },
        {
            quote: t('testimonials.quote3'),
            author: t('testimonials.author3'),
            initials: 'ZM',
            location: t('testimonials.location3'),
            product: t('testimonials.product3'),
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-[#FAF8F5] transition-colors border-b border-[#E7DED0]/60">
            <div className="vakaa-container space-y-10 sm:space-y-14">
                {/* Section Header */}
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A66B2D]">
                        Témoignages & Avis
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                        Ce Que Dit Le Cercle
                    </h2>
                    <p className="text-xs sm:text-sm text-[#3A2418]/70 font-sans leading-relaxed pt-1">
                        Adopté et chéri par des passionnés d&apos;élégance dans plus de 40 pays.
                    </p>
                </div>

                {/* 3 Modern Testimonial Cards (Seamless Pillowed Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between bg-[#F3EFE9] p-6 sm:p-8 rounded-3xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <div className="space-y-4">
                                {/* Card Header with Avatar, Verified Badge, and Quote Icon */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-11 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#1D120A] shadow-xs shrink-0">
                                            {review.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D120A]">
                                                {review.author}
                                            </h4>
                                            <p className="text-[11px] text-[#3A2418]/60">
                                                {review.location}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="size-8 rounded-full bg-white/70 flex items-center justify-center text-[#A66B2D] shrink-0">
                                        <Quote className="w-3.5 h-3.5 fill-[#A66B2D]/20" />
                                    </span>
                                </div>

                                {/* Star Rating & Verified Pill */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-1 text-[#D4A43C]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3.5 h-3.5 fill-[#D4A43C] text-[#D4A43C]"
                                            />
                                        ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2D7A46] uppercase tracking-wider bg-[#2D7A46]/10 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Acheteur Vérifié
                                    </span>
                                </div>

                                {/* Quote */}
                                <p className="text-xs sm:text-sm text-[#1D120A]/85 leading-relaxed font-sans pt-1">
                                    &ldquo;{review.quote}&rdquo;
                                </p>
                            </div>

                            {/* Product Tag Footer */}
                            <div className="pt-4 mt-4 border-t border-[#1D120A]/10 text-xs">
                                <span className="font-medium text-[#1D120A]/70 truncate block">
                                    {review.product}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
