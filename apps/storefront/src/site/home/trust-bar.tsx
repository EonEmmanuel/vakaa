import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Sparkles, Gem, ShieldCheck, Globe } from 'lucide-react';

export async function TrustBar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    const items = [
        {
            icon: Sparkles,
            title: t('trust.artisans.title'),
            description: t('trust.artisans.description'),
        },
        {
            icon: Gem,
            title: t('trust.materials.title'),
            description: t('trust.materials.description'),
        },
        {
            icon: ShieldCheck,
            title: t('trust.payments.title'),
            description: t('trust.payments.description'),
        },
        {
            icon: Globe,
            title: t('trust.delivery.title'),
            description: t('trust.delivery.description'),
        },
    ];

    return (
        <section className="relative z-20 border-y border-[#3A291C] bg-[#1D120A] text-[#F8F4EE] py-4 sm:py-6 md:py-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors">
            <div className="vakaa-container">
                <div className="grid grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
                    {items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3.5 group">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2A1A10] border border-[#D4A43C]/25 flex items-center justify-center shrink-0">
                                    <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D4A43C] stroke-[1.75] transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-[8px] sm:text-[11px] lg:text-xs font-bold tracking-wider uppercase text-[#F8F4EE] leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-[7px] sm:text-[10px] lg:text-[11px] text-[#B5A496] leading-tight line-clamp-2 sm:line-clamp-none">
                                        {item.description}
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
