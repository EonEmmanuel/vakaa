import Image from "next/image";
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getRouteLocale } from '@/platform/i18n/server';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';
import { TrustBar } from '@/components/shared/trust-bar';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Journal' });
    return {
        title: `${t('title')} | VAKAA Journal`,
        description: t('subtitle'),
    };
}

export async function JournalPage() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'Journal' });
    const tCommon = await getTranslations({ locale, namespace: 'Common' });

    const isFr = locale === 'fr';

    const articles = isFr
        ? [
            {
                title: "L'Art du Raphia : De la Palme Sauvage à la Haute Couture",
                excerpt: "Découvrez comment les fibres de palmier raphia de Madagascar et d'Afrique de l'Ouest sont récoltées avec soin, teintées à la main et sublimées en accessoires d'exception.",
                image: "/images/artisan-hands.jpg",
                date: "24 Septembre 2026",
                slug: "art-du-raphia",
            },
            {
                title: "Entretenir vos Sacs en Raphia & Cuir Végétal",
                excerpt: "Conseils précieux pour nettoyer, nourrir et préserver l'éclat de votre maroquinerie artisanale au fil des années.",
                image: "/images/cat-tote.jpg",
                date: "18 Septembre 2026",
                slug: "entretenir-sacs-raphia-cuir",
            },
            {
                title: "Le Langage Secret des Symboles Adinkra",
                excerpt: "Une immersion dans les philosophies ancestrales gravées dans nos pièces de joaillerie et boucles de laiton fondu à la cire perdue.",
                image: "/images/cat-accessory.jpg",
                date: "12 Septembre 2026",
                slug: "symboles-adinkra-laiton",
            },
            {
                title: "Du Quotidien aux Galas : Porter la Pochette VAKAA",
                excerpt: "Quatre inspirations stylistiques pour sublimer vos silhouettes, des déjeuners décontractés aux grandes réceptions de soirée.",
                image: "/images/cat-clutch.jpg",
                date: "05 Septembre 2026",
                slug: "porter-la-pochette-vakaa",
            },
            {
                title: "Au Coeur de l'Atelier de Douala : Finition des Tranches & Point Sellier",
                excerpt: "Plongée au sein de notre atelier où chaque tranche de cuir est poncée, teintée et cousue à la main pour une longévité absolue.",
                image: "/images/cat-shoulder.jpg",
                date: "28 Août 2026",
                slug: "atelier-douala-finition-point-sellier",
            },
            {
                title: "Le Manifeste du Slow Luxury : L'Élégance Hors du Temps",
                excerpt: "Pourquoi nous concevons des séries limitées hors du calendrier éphémère de la mode, en plaçant le respect du temps au cœur du luxe.",
                image: "/images/cat-crossbody.jpg",
                date: "20 Août 2026",
                slug: "manifeste-slow-luxury",
            },
        ]
        : [
            {
                title: "The Art of Raffia: From Palm Frond to High Fashion",
                excerpt: "Discover how wild raffia palm fibers from Madagascar and West Africa are ethically harvested, hand-dyed, and woven into high-fashion luxury accessories.",
                image: "/images/artisan-hands.jpg",
                date: "September 24, 2026",
                slug: "art-of-raffia",
            },
            {
                title: "How to Care for Handcrafted Raffia & Vegetable-Tanned Leather",
                excerpt: "Essential preservation rituals to clean, condition, and protect your heirloom leather and raffia bags through decades of wear.",
                image: "/images/cat-tote.jpg",
                date: "September 18, 2026",
                slug: "caring-for-raffia-leather",
            },
            {
                title: "The Secret Language of Adinkra Symbols in Cast Brass",
                excerpt: "An exploration of timeless West African philosophical symbols cast into our signature heirloom hardware using ancestral lost-wax casting.",
                image: "/images/cat-accessory.jpg",
                date: "September 12, 2026",
                slug: "adinkra-symbols-brass",
            },
            {
                title: "From Daylight to Black-Tie: Styling the Crossbody",
                excerpt: "Four versatile styling edits that seamlessly transition handcrafted African luxury from casual brunches to evening galas.",
                image: "/images/cat-clutch.jpg",
                date: "September 05, 2026",
                slug: "styling-the-crossbody",
            },
            {
                title: "Inside the Douala Atelier: Hand-Edge Finishing & Saddle Stitching",
                excerpt: "Step inside our master workshop where raw edges are meticulously burnished, edge-painted, and saddle-stitched for unmatched durability.",
                image: "/images/cat-shoulder.jpg",
                date: "August 28, 2026",
                slug: "inside-douala-atelier",
            },
            {
                title: "The Slow Luxury Manifesto: Heirloom Craftsmanship Beyond Seasons",
                excerpt: "Why we choose small artisanal batches over transient fashion cycles, centering patience and enduring value in everything we create.",
                image: "/images/cat-crossbody.jpg",
                date: "August 20, 2026",
                slug: "slow-luxury-manifesto",
            },
        ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1D120A] flex flex-col">
            {/* 1. Centered Breadcrumb Hero Banner */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3 max-w-3xl mx-auto">
                    <span className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D]">
                        {t('badge')}
                    </span>
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        {t('title')}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#3A2418]/70 max-w-xl mx-auto font-sans leading-relaxed">
                        {t('subtitle')}
                    </p>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 pt-2">
                        <Link href="/" className="hover:text-[#A66B2D] transition-colors cursor-pointer">
                            {tCommon('home') || 'Home'}
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            {t('title')}
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main 3-Column Articles Grid */}
            <main className="vakaa-container py-14 sm:py-20 flex-1 max-w-6xl mx-auto space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {articles.map((article, idx) => (
                        <article
                            key={idx}
                            className="group bg-[#FAF8F5] rounded-3xl p-3 border border-[#E7DED0]/80 hover:border-[#D4A43C]/50 transition-all hover:shadow-sm flex flex-col space-y-4"
                        >
                            {/* Inner Image Container with luxury date badge */}
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3EFE9] border border-[#E7DED0]/60">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {/* Luxury Date Badge Pill at Bottom Center */}
                                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10">
                                    <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] text-[#1D120A] border border-[#E7DED0]/80 shadow-2xs text-[11px] sm:text-xs font-medium px-3.5 py-1 rounded-full whitespace-nowrap">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C] shrink-0" aria-hidden="true" />
                                        {article.date}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-2 pb-2 pt-1 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                    <h2 className="font-sans text-base sm:text-lg font-bold text-[#1D120A] tracking-tight group-hover:text-[#A66B2D] transition-colors leading-snug">
                                        {article.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-[#3A2418]/70 leading-relaxed font-sans line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={`/journal#${article.slug}`}
                                        className="text-xs font-bold text-[#1D120A] underline underline-offset-4 hover:text-[#A66B2D] transition-colors inline-block"
                                    >
                                        {t('readArticle') || 'Read More'}
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 3. Pagination Controls */}
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        type="button"
                        aria-label="Previous Page"
                        className="size-9 rounded-full flex items-center justify-center text-[#3A2418]/60 hover:text-[#1D120A] hover:bg-[#F3EFE9] transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="size-4" />
                    </button>

                    <button
                        type="button"
                        className="size-9 rounded-full bg-[#1D120A] text-[#FAF8F5] font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        className="size-9 rounded-full hover:bg-[#F3EFE9] text-[#1D120A] font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                        2
                    </button>

                    <button
                        type="button"
                        className="size-9 rounded-full hover:bg-[#F3EFE9] text-[#1D120A] font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                        3
                    </button>

                    <span className="text-[#3A2418]/50 text-xs px-1">...</span>

                    <button
                        type="button"
                        className="size-9 rounded-full hover:bg-[#F3EFE9] text-[#1D120A] font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer"
                    >
                        10
                    </button>

                    <button
                        type="button"
                        aria-label="Next Page"
                        className="size-9 rounded-full flex items-center justify-center text-[#3A2418]/60 hover:text-[#1D120A] hover:bg-[#F3EFE9] transition-colors cursor-pointer"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </main>

            {/* 4. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
