import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Journal'});
    return {
        title: `${t('title')} | VAKAA`,
        description: t('subtitle'),
    };
}

export async function JournalPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Journal'});

    const articles = [
        {
            category: t('article1Category'),
            title: t('article1Title'),
            excerpt: t('article1Excerpt'),
            image: "/images/cat-clutch.jpg",
            readTime: "4 min read",
            date: "August 2026",
        },
        {
            category: t('article2Category'),
            title: t('article2Title'),
            excerpt: t('article2Excerpt'),
            image: "/images/cat-accessory.jpg",
            readTime: "6 min read",
            date: "July 2026",
        },
        {
            category: t('article3Category'),
            title: t('article3Title'),
            excerpt: t('article3Excerpt'),
            image: "/images/cat-crossbody.jpg",
            readTime: "5 min read",
            date: "June 2026",
        },
    ];

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Editorial Hero Header */}
            <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {t('badge')}
                        </span>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] uppercase">
                            {t('title')}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg md:text-xl text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Lead Editorial Story */}
            <section className="py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="bg-[#FAF7F2] dark:bg-[#1D120A]/70 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm hover:shadow-md transition-shadow">
                        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[460px] bg-[#EFE8DD] dark:bg-[#2A1B10]">
                            <Image
                                src="/images/cat-tote.jpg"
                                alt={t('featuredTitle')}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                        </div>
                        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="font-bold tracking-widest text-[#D4A43C] uppercase">
                                        {t('featuredTag')}
                                    </span>
                                    <span className="text-[#6B5E55] dark:text-[#B5A496]">•</span>
                                    <span className="flex items-center gap-1 text-[#6B5E55] dark:text-[#B5A496]">
                                        <Clock className="w-3.5 h-3.5" />
                                        {t('readTime')}
                                    </span>
                                </div>
                                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                                    {t('featuredTitle')}
                                </h2>
                                <p className="text-sm sm:text-base text-[#6B5E55] dark:text-[#B5A496] leading-relaxed font-sans">
                                    {t('featuredExcerpt')}
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href="/search?collection=tote-bags"
                                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] transition-colors"
                                >
                                    <span>{t('readArticle')}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16 sm:py-24">
                <div className="vakaa-container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                        {articles.map((article, idx) => (
                            <article
                                key={idx}
                                className="bg-[#FAF7F2] dark:bg-[#1D120A]/70 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C] overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFE8DD] dark:bg-[#2A1B10]">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <div className="absolute top-3 left-3 bg-[#1D120A]/90 text-[#F8F4EE] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-xs">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 text-[11px] text-[#6B5E55] dark:text-[#B5A496]">
                                            <span>{article.date}</span>
                                            <span>•</span>
                                            <span>{article.readTime}</span>
                                        </div>
                                        <h3 className="font-serif text-lg font-bold tracking-tight group-hover:text-[#D4A43C] transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] leading-relaxed font-sans">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Journal Newsletter Subscription Card */}
                    <div className="mt-16 sm:mt-20 bg-[#FAF7F2] dark:bg-[#1D120A]/70 border border-[#E7DED0]/80 dark:border-[#3A291C] rounded-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
                        <div className="w-10 h-10 rounded-full bg-[#EFE8DD] dark:bg-[#2A1B10] text-[#D4A43C] flex items-center justify-center mx-auto">
                            <BookOpen className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                                {t('newsletterTitle')}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#6B5E55] dark:text-[#B5A496] max-w-md mx-auto font-sans">
                                {t('newsletterDesc')}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder={t('newsletterPlaceholder')}
                                className="flex-1 bg-white dark:bg-[#140C06] border border-[#E7DED0] dark:border-[#3A291C] px-4 py-3 text-xs rounded-sm focus:outline-none focus:border-[#D4A43C] transition-colors"
                            />
                            <button
                                type="button"
                                className="bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-sm transition-colors cursor-pointer"
                            >
                                {t('newsletterButton')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
