import Image from 'next/image';
import {Link} from '@/platform/i18n/navigation';
import {Star, ArrowRight, Check} from 'lucide-react';

export function FeaturedBagSpotlight() {
    const featuredBags = [
        {
            title: 'Sac Baguette Terre Émeraude',
            subtitle: 'Collection Horizon — Capsule Végétale',
            description:
                'Une silhouette architecturale épurée alliant raphia teinté aux pigments minéraux et cuir tanné végétal. Poignée sculptée et fermoir en laiton doré poli main.',
            price: '390 €',
            rating: 5.0,
            reviewCount: 42,
            image: '/images/bags/baguette-terre-emeraude-1.jpg',
            slug: 'baguette-terre-emeraude',
            badge: 'Coup de Cœur Atelier',
            colors: ['#2F4F4F', '#1C3144', '#C29332'],
            highlights: ['Raphia sauvage certifié', 'Cuir végétal pleine fleur', 'Fermoir laiton frappé'],
        },
        {
            title: 'Cabas Maa Bolgatanga',
            subtitle: 'Grand Format Voyage & Quotidien',
            description:
                'Le symbole absolu de la slow fashion africaine. Plus de 35 heures de tressage continu pour une résistance exceptionnelle et une légèreté incomparable.',
            price: '460 €',
            rating: 4.9,
            reviewCount: 68,
            image: '/images/bags/maa-tote.jpg',
            slug: 'maa-tote',
            badge: 'Bestseller International',
            colors: ['#E3C598', '#8B5A2B', '#1B1B1B'],
            highlights: ['Tressage ancestral Bolga', 'Double anse cuir renforcée', 'Pochon lin bio inclus'],
        },
    ];

    return (
        <section className="py-14 sm:py-20 bg-[#FAF8F5] dark:bg-[#140C06] transition-colors border-b border-[#E7DED0]/60">
            <div className="vakaa-container space-y-16 lg:space-y-20">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E7DED0] dark:border-[#2C1D13]">
                    <div className="space-y-2 max-w-xl">
                        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D] dark:text-[#D4A43C]">
                            Créations Signatures
                        </span>
                        <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                            L&apos;Éloge du Détail
                        </h2>
                    </div>
                    <p className="text-sm text-[#3A2418]/70 dark:text-[#E7DED0]/70 max-w-md font-sans leading-relaxed">
                        Chaque création est conçue pour traverser les saisons sans jamais perdre son éclat. 
                        Une rencontre harmonieuse entre pureté formelle et matières brutes nobles.
                    </p>
                </div>

                {/* 2 Horizontal Split Feature Cards */}
                <div className="space-y-12 lg:space-y-16">
                    {featuredBags.map((bag, idx) => {
                        const isEven = idx % 2 === 1;
                        return (
                            <div
                                key={bag.slug}
                                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1C120A] border border-[#E7DED0]/90 dark:border-[#332216] shadow-xs hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Bag Image Container */}
                                <div
                                    className={`lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF8F5] dark:bg-[#25170E] group ${
                                        isEven ? 'lg:order-2' : 'lg:order-1'
                                    }`}
                                >
                                    <Image
                                        src={bag.image}
                                        alt={bag.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Clean Top Pill Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#180F08]/85 backdrop-blur-md text-[#1D120A] dark:text-[#D4A43C] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border border-black/10 dark:border-[#D4A43C]/30 shadow-xs">
                                        <span>{bag.badge}</span>
                                    </div>
                                </div>

                                {/* Bag Story & Technical Specs */}
                                <div
                                    className={`lg:col-span-6 space-y-6 ${
                                        isEven ? 'lg:order-1' : 'lg:order-2'
                                    }`}
                                >
                                    <div className="space-y-2">
                                        {/* Rating Bar */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5 text-[#D4A43C]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 fill-[#D4A43C] text-[#D4A43C]"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-semibold text-[#1D120A] dark:text-[#F8F4EE]">
                                                {bag.rating.toFixed(1)}
                                            </span>
                                            <span className="text-xs text-[#3A2418]/60 dark:text-[#E7DED0]/50">
                                                ({bag.reviewCount} avis certifiés)
                                            </span>
                                        </div>

                                        <p className="text-xs font-bold uppercase tracking-widest text-[#A66B2D] dark:text-[#D4A43C]">
                                            {bag.subtitle}
                                        </p>
                                        <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE]">
                                            {bag.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm sm:text-base text-[#3A2418]/80 dark:text-[#E7DED0]/80 leading-relaxed font-sans">
                                        {bag.description}
                                    </p>

                                    {/* Highlights Checklist */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                        {bag.highlights.map((highlight, hIdx) => (
                                            <div
                                                key={hIdx}
                                                className="flex items-center gap-2 text-xs font-medium text-[#1D120A]/90 dark:text-[#F8F4EE]/90"
                                            >
                                                <span className="w-4 h-4 rounded-full bg-[#A66B2D]/15 text-[#A66B2D] dark:text-[#D4A43C] flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5" />
                                                </span>
                                                <span>{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Colorways and Price */}
                                    <div className="pt-2 flex items-center justify-between border-t border-[#E7DED0] dark:border-[#2C1D13]">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A2418]/60 dark:text-[#E7DED0]/60 block">
                                                Teintes d&apos;Atelier
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                {bag.colors.map((color, cIdx) => (
                                                    <span
                                                        key={cIdx}
                                                        className="w-5 h-5 rounded-full border border-black/20 dark:border-white/20 shadow-xs"
                                                        style={{backgroundColor: color}}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A2418]/60 dark:text-[#E7DED0]/60 block">
                                                Prix d&apos;Atelier
                                            </span>
                                            <span className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                                                {bag.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <Link
                                            href={`/product/${bag.slug}`}
                                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] transition-all duration-300 shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                                        >
                                            <span>Explorer la pièce</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>

                                        <Link
                                            href="/collection"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#A66B2D] dark:hover:text-[#D4A43C] border border-[#E7DED0] dark:border-[#332216] hover:border-[#A66B2D]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent"
                                        >
                                            <span>Voir la ligne complète</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dual Editorial Banners in Whitish & Sand Luxury Palette */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Banner 1: Warm Sand Ivory Card */}
                    <div className="relative rounded-2xl p-8 sm:p-10 bg-[#F5EFEB] dark:bg-[#1C120A] text-[#1D120A] dark:text-[#F8F4EE] overflow-hidden border border-[#E7DED0] dark:border-[#332216] flex flex-col justify-between min-h-[240px] group shadow-xs hover:shadow-md transition-shadow">
                        <div className="relative z-10 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A66B2D] dark:text-[#D4A43C]">
                                Édition Limitée
                            </span>
                            <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                                L&apos;Art du Tressage Ancestral
                            </h3>
                            <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#E7DED0]/70 max-w-sm font-sans pt-1">
                                Découvrir le processus de récolte du raphia sauvage et la teinture végétale naturelle.
                            </p>
                        </div>
                        <div className="relative z-10 pt-6">
                            <Link
                                href="/our-story"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#D4A43C] hover:text-[#A66B2D] transition-colors group-hover:translate-x-1 duration-300 cursor-pointer"
                            >
                                <span>Lire le manifeste</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Banner 2: Pure White Clean Card */}
                    <div className="relative rounded-2xl p-8 sm:p-10 bg-white dark:bg-[#20150D] text-[#1D120A] dark:text-[#F8F4EE] overflow-hidden border border-[#E7DED0] dark:border-[#3A291C] flex flex-col justify-between min-h-[240px] group shadow-xs hover:shadow-md transition-shadow">
                        <div className="relative z-10 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A66B2D] dark:text-[#D4A43C]">
                                Engagement Solidaire
                            </span>
                            <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                                100% Salaires Décentes & Émancipation
                            </h3>
                            <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#E7DED0]/70 max-w-sm font-sans pt-1">
                                Nos ateliers soutiennent directement plus de 150 artisanes et leurs familles au Ghana et au Sénégal.
                            </p>
                        </div>
                        <div className="relative z-10 pt-6">
                            <Link
                                href="/artisans"
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#D4A43C] hover:text-[#A66B2D] transition-colors group-hover:translate-x-1 duration-300 cursor-pointer"
                            >
                                <span>Rencontrer les artisanes</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
