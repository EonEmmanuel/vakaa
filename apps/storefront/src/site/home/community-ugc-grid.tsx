import Image from "next/image";
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

function InstagramIcon({className = ""}: {className?: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

export async function CommunityUgcGrid() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const moments = [
        {
            image: "/images/cat-tote.jpg",
            alt: "Maa Tote styled on city street",
            city: "London",
        },
        {
            image: "/images/cat-shoulder.jpg",
            alt: "Kemi Shoulder Bag styled at gallery event",
            city: "Paris",
        },
        {
            image: "/images/cat-clutch.jpg",
            alt: "Zuri Clutch styled at golden hour",
            city: "New York",
        },
        {
            image: "/images/cat-crossbody.jpg",
            alt: "Asa Crossbody styled in artisan market",
            city: "Accra",
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="vakaa-container">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D4A43C]">
                            {t('community.eyebrow')}
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase">
                            {t('community.title')}
                        </h2>
                    </div>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1D120A] dark:text-[#D4A43C] hover:text-[#D4A43C] transition-colors"
                    >
                        <InstagramIcon className="w-4 h-4 text-[#D4A43C]" />
                        <span>{t('community.handle')}</span>
                    </a>
                </div>

                {/* 4 Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {moments.map((item, idx) => (
                        <div
                            key={idx}
                            style={{ position: 'relative' }}
                            className="group relative aspect-square rounded-lg overflow-hidden bg-[#EFE8DD] dark:bg-[#20150D] shadow-xs"
                        >
                            <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                            />
                            {/* Overlay tag */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                                    {item.city}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
