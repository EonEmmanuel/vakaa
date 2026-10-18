import { Truck, Moon, ShieldCheck, Leaf } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function TrustBar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Home' });

    const tiles = [
        {
            icon: Truck,
            statNum: '48',
            statUnit: 'h',
            title: t('trust.tile1Title'),
            desc: t('trust.tile1Desc'),
            bgClass: 'bg-[#dbe3ee] dark:bg-[#1f2833]',
        },
        {
            icon: Moon,
            statNum: '30',
            statUnit: ' ' + (locale === 'fr' ? 'jours' : 'days'),
            title: t('trust.tile2Title'),
            desc: t('trust.tile2Desc'),
            bgClass: 'bg-[#efded7] dark:bg-[#2b1f1d]',
        },
        {
            icon: ShieldCheck,
            statNum: '10',
            statUnit: ' ' + (locale === 'fr' ? 'ans' : 'years'),
            title: t('trust.tile3Title'),
            desc: t('trust.tile3Desc'),
            bgClass: 'bg-[#f1e7c6] dark:bg-[#2c281a]',
        },
        {
            icon: Leaf,
            statNum: '100',
            statUnit: '%',
            title: t('trust.tile4Title'),
            desc: t('trust.tile4Desc'),
            bgClass: 'bg-[#dbe4d3] dark:bg-[#1c271e]',
        },
    ];

    return (
        <section className="px-3 sm:px-5 bg-[#f2efe9] dark:bg-[#151413] pt-14 sm:pt-24 pb-14 sm:pb-24">
            <div className="max-w-[1720px] mx-auto">
                {/* ═══ Header: The Promise ═══ */}
                <div className="mb-7 sm:mb-12 max-w-2xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8C6D23] dark:text-[#D4A43C] font-semibold">
                        {t('trust.eyebrow')}
                    </p>
                    <h2 className="font-display mt-2 text-[clamp(2.15rem,4.5vw,3.75rem)] font-bold text-[#1c1b18] dark:text-[#fbfaf7] tracking-tight leading-[1.05]">
                        {t('trust.title')}
                    </h2>
                </div>

                {/* ═══ 4 Bento Promise Cards (Exact KVIST 2-col mobile / 4-col desktop) ═══ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                    {tiles.map((tile, idx) => {
                        const Icon = tile.icon;
                        return (
                            <div
                                key={idx}
                                className={`group flex h-full flex-col justify-between gap-4 sm:gap-6 rounded-[22px] sm:rounded-[26px] p-4 sm:p-7 ${tile.bgClass} border border-black/5 dark:border-white/5 shadow-tile min-h-[175px] sm:min-h-[240px] transition-all duration-300 hover:shadow-lift`}
                            >
                                <span className="grid size-9 sm:size-12 place-items-center rounded-xl sm:rounded-2xl bg-white/90 dark:bg-white/10 text-[#1c1b18] dark:text-[#fbfaf7] shadow-xs">
                                    <Icon className="size-4 sm:size-5 stroke-[2]" />
                                </span>

                                <div>
                                    <p className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7] leading-none">
                                        <span className="tabular-nums">{tile.statNum}</span>
                                        <span className="text-sm sm:text-lg lg:text-2xl font-semibold ml-0.5">{tile.statUnit}</span>
                                    </p>
                                    <p className="mt-1.5 sm:mt-3 font-semibold text-[13.5px] sm:text-[16.5px] leading-snug text-[#1c1b18] dark:text-[#fbfaf7]">
                                        {tile.title}
                                    </p>
                                    <p className="mt-1 hidden sm:block text-[13px] sm:text-[13.5px] leading-snug text-[#57544c] dark:text-[#a6a29a]">
                                        {tile.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}