import Image from 'next/image';
import {Link} from '@/platform/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {ArrowRight, Sparkles} from 'lucide-react';

export async function CollectionGridPreview() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const categories = [
        {
            title: "Tote Bags",
            tagline: "Cabas & Vannerie Noble",
            image: "/images/cat-tote.jpg",
            href: "/search?category=tote-bags",
        },
        {
            title: "Shoulder Bags",
            tagline: "Sacs Porté Épaule",
            image: "/images/cat-shoulder.jpg",
            href: "/search?category=shoulder-bags",
        },
        {
            title: "Clutches",
            tagline: "Pochettes & Minaudières",
            image: "/images/cat-clutch.jpg",
            href: "/search?category=clutches",
        },
        {
            title: "Crossbodies",
            tagline: "Sacs Bandoulière",
            image: "/images/cat-crossbody.jpg",
            href: "/search?category=crossbodies",
        },
        {
            title: "Accessories",
            tagline: "Petite Maroquinerie",
            image: "/images/cat-accessory.jpg",
            href: "/search?category=accessories",
        },
    ];

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="vakaa-container">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div className="space-y-1 sm:space-y-1.5">
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                            {t('collections.title')}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#A66B2D] dark:text-[#D4A43C] font-serif italic tracking-wide">
                            Lignes signatures & silhouettes de saison
                        </p>
                    </div>

                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#1D120A] dark:text-[#D4A43C] hover:text-[#D4A43C] transition-colors py-1"
                    >
                        <span>{t('collections.viewAll')}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Editorial Collection Grid with Consistent Portrait Proportions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className="group relative flex flex-col overflow-hidden rounded-md bg-[#FAF7F2] dark:bg-[#181008] border border-[#E7DED0]/70 dark:border-[#3A291C] hover:border-[#D4A43C]/50 transition-all duration-500 shadow-xs hover:shadow-xl"
                        >
                            {/* Portrait Image Container */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE8DD] dark:bg-[#20150D]">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/90 line-clamp-1">
                                        {cat.tagline}
                                    </span>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="p-3 sm:p-3.5 flex items-center justify-between">
                                <h3 className="font-serif text-xs sm:text-sm font-bold tracking-wide text-[#1D120A] dark:text-[#F8F4EE] group-hover:text-[#D4A43C] transition-colors">
                                    {cat.title}
                                </h3>
                                <ArrowRight className="size-3 text-[#1D120A]/40 dark:text-[#F8F4EE]/40 group-hover:text-[#D4A43C] group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
