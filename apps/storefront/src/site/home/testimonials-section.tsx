import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Star, CheckCircle2 } from 'lucide-react';

export async function TestimonialsSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const reviews = [
        {
            quote: t('testimonials.quote1'),
            author: t('testimonials.author1'),
            location: t('testimonials.location1'),
            product: t('testimonials.product1'),
        },
        {
            quote: t('testimonials.quote2'),
            author: t('testimonials.author2'),
            location: t('testimonials.location2'),
            product: t('testimonials.product2'),
        },
        {
            quote: t('testimonials.quote3'),
            author: t('testimonials.author3'),
            location: t('testimonials.location3'),
            product: t('testimonials.product3'),
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="vakaa-container">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 md:mb-16">
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D4A43C]">
                        {t('testimonials.eyebrow')}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-sm sm:text-base text-[#3A2418]/75 dark:text-[#F8F4EE]/65 leading-relaxed font-sans">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                {/* 3 Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between bg-[#EFE8DD]/60 dark:bg-[#20150D] p-6 sm:p-8 rounded-lg border border-[#E7DED0]/70 dark:border-[#3A291C] transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                        >
                            <div className="space-y-4">
                                {/* 5 Gold Stars */}
                                <div className="flex items-center gap-1 text-[#D4A43C]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#D4A43C] text-[#D4A43C]" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-sm sm:text-[15px] text-[#1D120A]/90 dark:text-[#F8F4EE]/90 leading-[1.65] font-sans italic">
                                    &ldquo;{review.quote}&rdquo;
                                </p>
                            </div>

                            {/* Author & Verification Meta */}
                            <div className="pt-6 mt-6 border-t border-[#E7DED0] dark:border-[#3A291C] space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE]">
                                        {review.author}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2D7A46] dark:text-[#38A169] uppercase tracking-wide">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {t('testimonials.verifiedBuyer')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-[#6B5E55] dark:text-[#B5A496]">
                                    <span>{review.location}</span>
                                    <span className="font-medium text-[#1D120A]/70 dark:text-[#F8F4EE]/70">{review.product}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
