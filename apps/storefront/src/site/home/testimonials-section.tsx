import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function TestimonialsSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Home' });

    const reviews = [
        {
            quote: t('testimonials.quote1'),
            author: t('testimonials.author1'),
            location: t('testimonials.location1'),
        },
        {
            quote: t('testimonials.quote2'),
            author: t('testimonials.author2'),
            location: t('testimonials.location2'),
        },
        {
            quote: t('testimonials.quote3'),
            author: t('testimonials.author3'),
            location: t('testimonials.location3'),
        },
    ];

    return (
        <section className="py-24 sm:py-32 bg-[#FAF8F5]">
            <div className="vakaa-container space-y-16">
                {/* Minimal Header */}
                <div className="space-y-4 max-w-2xl">
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#A66B2D]">
                        Témoignages
                    </span>
                    <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1D120A] tracking-tight leading-none">
                        Ce Que Dit Le Cercle
                    </h2>
                </div>

                {/* 3 Modern Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="animate-fade-up bg-[#F3EFE9] p-10 lg:p-12 border border-[#E7DED0]/50 flex flex-col justify-between"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <p className="text-xl sm:text-2xl text-[#1D120A] leading-relaxed font-sans mb-12">
                                &ldquo;{review.quote}&rdquo;
                            </p>
                            
                            <div className="mt-auto">
                                <div className="w-8 h-[2px] bg-[#D4A43C] mb-4" />
                                <h4 className="text-sm font-bold uppercase tracking-wider text-[#1D120A]">
                                    {review.author}
                                </h4>
                                <p className="text-xs text-[#3A2418]/60 mt-1">
                                    {review.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
