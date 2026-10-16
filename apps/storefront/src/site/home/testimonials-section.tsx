import Image from 'next/image';
import { Star, Check } from 'lucide-react';
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
            product: t('testimonials.product1'),
            avatar: '/images/avatars/avatar-1.jpg',
        },
        {
            quote: t('testimonials.quote2'),
            author: t('testimonials.author2'),
            location: t('testimonials.location2'),
            product: t('testimonials.product2'),
            avatar: '/images/avatars/avatar-2.jpg',
        },
        {
            quote: t('testimonials.quote3'),
            author: t('testimonials.author3'),
            location: t('testimonials.location3'),
            product: t('testimonials.product3'),
            avatar: '/images/avatars/avatar-3.jpg',
        },
    ];

    return (
        <section
            id="testimonials"
            className="px-3 sm:px-5 bg-[#f2efe9] dark:bg-[#151413] pt-14 sm:pt-24 pb-14 sm:pb-28 transition-colors duration-300"
            aria-labelledby="testimonials-heading"
        >
            <div className="max-w-[1720px] mx-auto">
                {/* ═══ Editorial Section Header (Exact KVIST Typography) ═══ */}
                <div className="mb-7 sm:mb-12 max-w-2xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8C6D23] dark:text-[#D4A43C] font-semibold">
                        {t('testimonials.eyebrow')}
                    </p>
                    <h2
                        id="testimonials-heading"
                        className="font-display mt-2.5 text-[clamp(2.15rem,4.5vw,3.75rem)] font-bold text-[#1c1b18] dark:text-[#fbfaf7] tracking-tight leading-[1.05]"
                    >
                        {t('testimonials.title')}
                    </h2>
                    <p className="mt-3 text-[14.5px] sm:text-[16px] text-[#57544c] dark:text-[#a6a29a] leading-relaxed">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                {/* ═══ Bento Review Cards (Mobile Snap-Scroll / Desktop 3-Col Grid) ═══ */}
                <div className="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-3 px-3 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
                    {reviews.map((review, idx) => (
                        <figure
                            key={idx}
                            className="tile flex w-[85%] shrink-0 snap-start flex-col justify-between p-6 sm:w-[62%] md:w-auto md:p-7 lg:p-8 rounded-[26px] bg-[#fbfaf7] dark:bg-[#1c1b19] border border-[#e2ddd2]/80 dark:border-white/10 shadow-tile transition-all duration-300 hover:border-[#1c1b18]/25 dark:hover:border-white/20 hover:shadow-lift"
                        >
                            <div>
                                {/* 5-Star Editorial Rating */}
                                <div className="flex items-center gap-1" aria-label="5 étoiles sur 5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="size-3.5 sm:size-4 fill-[#1c1b18] text-[#1c1b18] dark:fill-[#fbfaf7] dark:text-[#fbfaf7]"
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>

                                {/* Review Quote */}
                                <blockquote className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-[#1c1b18] dark:text-[#fbfaf7] font-sans font-normal">
                                    &ldquo;{review.quote}&rdquo;
                                </blockquote>
                            </div>

                            {/* Client Figcaption: Avatar, Verified Badge, Author & Bag Reference */}
                            <figcaption className="mt-6 sm:mt-8 pt-4 sm:pt-5 flex items-center gap-3.5 border-t border-[#e2ddd2]/50 dark:border-white/10">
                                <div className="relative size-11 overflow-hidden rounded-full bg-[#ebe5db] ring-1 ring-black/5 dark:ring-white/10 shrink-0">
                                    <Image
                                        src={review.avatar}
                                        alt={review.author}
                                        fill
                                        sizes="44px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0 text-[13.5px] sm:text-[14px] leading-snug">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <p className="font-semibold text-[#1c1b18] dark:text-[#fbfaf7] truncate">
                                            {review.author}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#8C6D23] dark:text-[#D4A43C] font-semibold bg-[#8C6D23]/10 dark:bg-[#D4A43C]/15 px-1.5 py-0.5 rounded-full shrink-0">
                                            <Check className="size-2.5 stroke-[2.5]" aria-hidden="true" />
                                            {t('testimonials.verifiedBuyer')}
                                        </span>
                                    </div>
                                    <p className="text-[#57544c] dark:text-[#a6a29a] text-[12px] sm:text-[12.5px] mt-0.5 truncate">
                                        {review.location} · <span className="font-medium text-[#1c1b18]/85 dark:text-[#fbfaf7]/85">{review.product}</span>
                                    </p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
