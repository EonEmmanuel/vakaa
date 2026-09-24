import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { Sparkles } from 'lucide-react';

export async function AnnouncementBar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Navigation' });

    return (
        <aside aria-label="Announcement" className="bg-[#D4A43C] text-[#1D120A] py-1.5 sm:py-2 px-4 transition-colors">
            <div className="vakaa-container flex items-center justify-center text-center">
                <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-bold tracking-[0.18em] uppercase leading-none">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#1D120A] text-[#1D120A] shrink-0 opacity-80" />
                    <span>{t('announcement')}</span>
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#1D120A] text-[#1D120A] shrink-0 opacity-80" />
                </div>
            </div>
        </aside>
    );
}
