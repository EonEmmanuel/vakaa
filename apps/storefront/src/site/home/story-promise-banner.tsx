import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';

export async function StoryPromiseBanner() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="py-8 sm:py-16 md:py-24 bg-[#F8F4EE] dark:bg-[#140C06] transition-colors">
            <div className="vakaa-container">
                <div className="bg-[#1D120A] text-[#F8F4EE] rounded-sm overflow-hidden border border-[#3A291C] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 shadow-md">
                    {/* Left Column: Narrative Copy */}
                    <div className="lg:col-span-6 p-6 sm:p-10 lg:p-14 flex flex-col justify-between space-y-4 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[#D4A43C]">
                                {t('promise.eyebrow')}
                            </span>
                            <h2 className="font-sans text-xl sm:text-2xl lg:text-[2.5rem] font-bold tracking-tight text-[#F8F4EE] leading-[1.08] uppercase">
                                {t('promise.title')}
                            </h2>
                        </div>

                        <p className="text-xs sm:text-sm md:text-base text-[#F8F4EE]/75 leading-relaxed font-sans">
                            {t('promise.description')}
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/our-story"
                                className="inline-flex items-center justify-center bg-[#D4A43C] hover:bg-[#BF9232] text-[#140C06] font-semibold tracking-wider text-[10px] sm:text-xs uppercase px-6 sm:px-8 py-3 sm:py-3.5 rounded-xs transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
                            >
                                {t('promise.cta')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Artisan Hands Photography */}
                    <div className="lg:col-span-6 relative min-h-[220px] sm:min-h-[300px] lg:min-h-[380px] bg-[#2A1B10]">
                        <Image
                            src="/images/artisan-hands.jpg"
                            alt="African artisan crafting luxury raffia bag"
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
