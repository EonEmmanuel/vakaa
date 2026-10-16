import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { HeroBentoGrid } from './hero-bento-grid';

export async function HeroSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Hero' });

    return (
        <section className="relative w-full bg-[#f2efe9] dark:bg-[#151413] overflow-hidden pt-20 sm:pt-24 pb-4 sm:pb-6">
            {/* Ambient Warm Radial Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(212,164,60,0.05)_0%,transparent_60%)] pointer-events-none" />

            <div className="w-full px-3 sm:px-5 lg:px-6 relative z-10">
                <HeroBentoGrid
                    t={{
                        titleLine1: t('titleLine1'),
                        titleLine2: t('titleLine2'),
                        titleLine3: t('titleLine3'),
                        subtitle: t('subtitle'),
                        shopCollection: t('shopCollection'),
                        ourStory: t('ourStory'),
                    }}
                />
            </div>
        </section>
    );
}
