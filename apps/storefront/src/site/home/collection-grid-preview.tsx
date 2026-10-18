import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function CollectionGridPreview() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Home' });

    const categories = [
        {
            title: t('collections.totesTitle'),
            subtitle: t('collections.totesSubtitle'),
            image: '/images/bags/maa-tote-transparent.png',
            href: '/search?category=totes',
            bgClass: 'bg-[#dbe4d3] dark:bg-[#1c271e]',
            containerClass: 'col-span-2 lg:col-span-2 lg:row-span-2',
            minHeight: 'min-h-[300px] lg:min-h-[520px]',
            titleClass: 'text-2xl sm:text-4xl lg:text-5xl font-semibold',
            imgPosClass: 'bottom-[4%] right-[4%] h-[74%] sm:h-[78%] w-[56%] sm:w-[60%]',
        },
        {
            title: t('collections.shoulderTitle'),
            subtitle: t('collections.shoulderSubtitle'),
            image: '/images/bags/kemi-shoulder-transparent.png',
            href: '/search?category=shoulder-bags',
            bgClass: 'bg-[#f1e7c6] dark:bg-[#2c281a]',
            containerClass: '',
            minHeight: 'min-h-[190px] sm:min-h-[230px] lg:min-h-0',
            titleClass: 'text-[15px] sm:text-xl font-semibold',
            imgPosClass: 'bottom-[4%] right-[4%] h-[60%] sm:h-[65%] w-[48%] sm:w-[52%]',
        },
        {
            title: t('collections.crossbodyTitle'),
            subtitle: t('collections.crossbodySubtitle'),
            image: '/images/bags/asa-crossbody-transparent.png',
            href: '/search?category=crossbody',
            bgClass: 'bg-[#ebe2d4] dark:bg-[#27231f]',
            containerClass: '',
            minHeight: 'min-h-[190px] sm:min-h-[230px] lg:min-h-0',
            titleClass: 'text-[15px] sm:text-xl font-semibold',
            imgPosClass: 'bottom-[4%] right-[4%] h-[60%] sm:h-[65%] w-[48%] sm:w-[52%]',
        },
        {
            title: t('collections.clutchesTitle'),
            subtitle: t('collections.clutchesSubtitle'),
            image: '/images/bags/zuri-clutch-transparent.png',
            href: '/search?category=clutches',
            bgClass: 'bg-[#efded7] dark:bg-[#2b1f1d]',
            containerClass: '',
            minHeight: 'min-h-[190px] sm:min-h-[230px] lg:min-h-0',
            titleClass: 'text-[15px] sm:text-xl font-semibold',
            imgPosClass: 'bottom-[4%] right-[4%] h-[60%] sm:h-[65%] w-[48%] sm:w-[52%]',
        },
        {
            title: t('collections.accessoriesTitle'),
            subtitle: t('collections.accessoriesSubtitle'),
            image: '/images/bags/aya-cardholder-transparent.png',
            href: '/search?category=accessories',
            bgClass: 'bg-[#dbe3ee] dark:bg-[#1f2833]',
            containerClass: '',
            minHeight: 'min-h-[190px] sm:min-h-[230px] lg:min-h-0',
            titleClass: 'text-[15px] sm:text-xl font-semibold',
            imgPosClass: 'bottom-[4%] right-[4%] h-[60%] sm:h-[65%] w-[48%] sm:w-[52%]',
        },
    ];

    return (
        <section className="px-3 sm:px-5 bg-[#f2efe9] dark:bg-[#151413] pt-12 sm:pt-20 pb-12 sm:pb-24">
            <div className="max-w-[1720px] mx-auto">
                {/* ═══ Header: Eyebrow + Monumental Title + View All Pill ═══ */}
                <div className="mb-6 sm:mb-10 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8C6D23] dark:text-[#D4A43C] font-semibold">
                            {t('collections.eyebrow')}
                        </p>
                        <h2 className="font-display mt-2 text-[clamp(2.15rem,4.5vw,3.75rem)] font-bold text-[#1c1b18] dark:text-[#fbfaf7] tracking-tight leading-[1.05]">
                            {t('collections.title')}
                        </h2>
                    </div>
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 text-[14px] sm:text-[15px] font-medium text-[#1c1b18] dark:text-[#fbfaf7] hover:text-[#8C6D23] dark:hover:text-[#D4A43C] transition-colors"
                    >
                        <span>{t('collections.viewAll')}</span>
                        <span className="grid size-9 place-items-center rounded-full bg-white dark:bg-white/10 border border-[#e2ddd2]/70 dark:border-white/10 shadow-tile transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight className="size-4" />
                        </span>
                    </Link>
                </div>

                {/* ═══ 4-Column Bento Grid with Asymmetric Pastel Tiles (Exact KVIST Layout) ═══ */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
                    {categories.map((cat, idx) => (
                        <div key={idx} className={cat.containerClass}>
                            <Link
                                href={cat.href}
                                className={`group relative flex h-full overflow-hidden rounded-[26px] p-4 sm:p-7 ${cat.bgClass} ${cat.minHeight} border border-black/5 dark:border-white/5 shadow-tile transition-all duration-300 hover:shadow-lift`}
                            >
                                {/* Top Label & Rotating Arrow */}
                                <div className="relative z-10 flex w-full items-start justify-between gap-1.5 sm:gap-2">
                                    <div className="min-w-0 pr-1">
                                        <p className={`font-display font-semibold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7] leading-tight ${cat.titleClass}`}>
                                            {cat.title}
                                        </p>
                                        <p className="mt-1 font-mono text-[10px] sm:text-[12px] uppercase tracking-wider text-[#57544c] dark:text-[#a6a29a] truncate">
                                            {cat.subtitle}
                                        </p>
                                    </div>
                                    <span className="grid size-8 sm:size-10 shrink-0 place-items-center rounded-full bg-white/85 dark:bg-white/10 text-[#1c1b18] dark:text-[#fbfaf7] transition-[transform,background-color] duration-500 ease-out group-hover:-rotate-45 group-hover:bg-[#1c1b18] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#1c1b18] shadow-xs">
                                        <ArrowRight className="size-3.5 sm:size-4" />
                                    </span>
                                </div>

                                {/* Floating Transparent Bag Cutout with Smooth Hover Lift & Tilt */}
                                <div className={`absolute pointer-events-none select-none transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:-rotate-3 ${cat.imgPosClass}`}>
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 640px) 160px, (max-width: 1024px) 300px, 420px"
                                        className="object-contain drop-shadow-[0_16px_20px_rgba(28,27,24,0.18)]"
                                    />
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
