import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function PressStatsStrip() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const stats = [
        {
            value: t('stats.stat1Value'),
            label: t('stats.stat1Label'),
        },
        {
            value: t('stats.stat2Value'),
            label: t('stats.stat2Label'),
        },
        {
            value: t('stats.stat3Value'),
            label: t('stats.stat3Label'),
        },
        {
            value: t('stats.stat4Value'),
            label: t('stats.stat4Label'),
        },
    ];

    return (
        <section className="bg-[#1D120A] text-[#F8F4EE] py-12 md:py-16 transition-colors">
            <div className="vakaa-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="space-y-1.5 flex flex-col items-center">
                            <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#D4A43C]">
                                {stat.value}
                            </span>
                            <p className="text-xs sm:text-[13px] text-[#EFE8DD]/80 font-medium tracking-wide max-w-[24ch] uppercase">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
