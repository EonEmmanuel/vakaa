import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function AnnouncementBar() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Navigation' });

    return (
        <aside aria-label="Announcement" className="bg-[#D4A43C] text-[#1D120A] py-1.5 sm:py-2 px-4 transition-colors">
            <div className="vakaa-container flex items-center justify-center text-center">
                <div className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] uppercase leading-none">
                    <span>{t('announcement')}</span>
                </div>
            </div>
        </aside>
    );
}
