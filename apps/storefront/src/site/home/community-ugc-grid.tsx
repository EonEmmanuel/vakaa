import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';

function InstagramIcon({className = ''}: {className?: string}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
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
            image: '/images/cat-tote.jpg',
            alt: 'Cabas Maa porté à Londres',
            city: 'Londres',
            handle: '@clara_m',
        },
        {
            image: '/images/cat-shoulder.jpg',
            alt: 'Sac Kemi porté lors du vernissage à Paris',
            city: 'Paris',
            handle: '@sophie.mode',
        },
        {
            image: '/images/bags/baguette-indigo-savane-3.jpg',
            alt: 'Baguette Indigo Savane lors de la Fashion Week de Milan',
            city: 'Milan',
            handle: '@amina_style',
        },
        {
            image: '/images/cat-clutch.jpg',
            alt: 'Pochette Zuri dorée à New York',
            city: 'New York',
            handle: '@zara_nyc',
        },
        {
            image: '/images/cat-crossbody.jpg',
            alt: 'Bandoulière Asa au coucher de soleil à Dakar',
            city: 'Dakar',
            handle: '@fatou_diop',
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-[#FAF8F5] dark:bg-[#140C06] transition-colors border-t border-[#E7DED0] dark:border-[#2C1D13]">
            <div className="vakaa-container space-y-10 sm:space-y-12">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-[#E7DED0] dark:border-[#2C1D13]">
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D] dark:text-[#D4A43C]">
                            {t('community.eyebrow')}
                        </span>
                        <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                            {t('community.title')}
                        </h2>
                    </div>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] transition-colors group cursor-pointer"
                    >
                        <InstagramIcon className="w-4 h-4 text-[#D4A43C] group-hover:scale-110 transition-transform duration-300" />
                        <span>{t('community.handle')}</span>
                    </a>
                </div>

                {/* 5-Column Responsive Gallery */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                    {moments.map((item, idx) => (
                        <div
                            key={idx}
                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#EFE8DD] dark:bg-[#20150D] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                        >
                            <Image
                                src={item.image}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Hover overlay with social handle and city */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A43C]">
                                    {item.city}
                                </span>
                                <span className="text-xs font-semibold tracking-wide text-white/95 mt-0.5">
                                    {item.handle}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
