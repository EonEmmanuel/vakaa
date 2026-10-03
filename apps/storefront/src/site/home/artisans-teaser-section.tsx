import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { ArrowRight } from 'lucide-react';

export async function ArtisansTeaserSection() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="py-14 sm:py-16 md:py-24 bg-[#EFE8DD]/40 dark:bg-[#181008] border-y border-[#E7DED0]/70 dark:border-[#3A291C] transition-colors">
            <div className="vakaa-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
                    {/* Left Column: Visual Moment */}
                    <div className="lg:col-span-6 order-2 lg:order-1">
                        <div
                            style={{ position: 'relative' }}
                            className="relative w-full aspect-[4/3] rounded-md sm:rounded-lg overflow-hidden bg-[#EFE8DD] dark:bg-[#20150D] shadow-sm"
                        >
                            <Image
                                src="/images/artisan-hands.jpg"
                                alt="Ghanaian master artisan hand-weaving luxury raffia bag"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center transition-transform duration-700 hover:scale-102"
                            />
                        </div>
                    </div>

                    {/* Right Column: Narrative */}
                    <div className="lg:col-span-6 space-y-5 sm:space-y-6 order-1 lg:order-2 text-center sm:text-left">
                        <div className="space-y-2 sm:space-y-3">
                            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D4A43C]">
                                {t('artisansTeaser.eyebrow')}
                            </span>
                            <h2 className="font-sans text-2xl sm:text-3xl lg:text-[2.6rem] font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] leading-[1.08] uppercase">
                                {t('artisansTeaser.title')}
                            </h2>
                        </div>

                        <p className="text-sm sm:text-base md:text-lg text-[#3A2418]/80 dark:text-[#F8F4EE]/70 leading-[1.7] font-sans max-w-[50ch] mx-auto sm:mx-0">
                            {t('artisansTeaser.description')}
                        </p>

                        <div className="pt-2 flex justify-center sm:justify-start">
                            <Link
                                href="/search?collection=artisans"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] font-semibold tracking-wider text-xs uppercase px-8 py-4 rounded-md shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
                            >
                                <span>{t('artisansTeaser.cta')}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
