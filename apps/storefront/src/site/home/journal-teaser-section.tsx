import Image from 'next/image';
import {Link} from '@/platform/i18n/navigation';
import {ArrowRight, Clock, BookOpen} from 'lucide-react';

export function JournalTeaserSection() {
    const articles = [
        {
            title: 'La Récolte Sacrée du Raphia Sauvage de Madagascar',
            slug: 'recolte-raphia-sauvage',
            category: 'Savoir-Faire',
            readTime: '4 min',
            date: '22 Septembre 2026',
            image: '/images/bags/baguette-indigo-savane-2.jpg',
            excerpt:
                'Voyage au cœur des palmeraies de la Grande Île, là où nos artisanes sélectionnent les fibres les plus soyeuses pour concevoir des pièces inaltérables.',
        },
        {
            title: 'Le Cuir Tanné Végétal : Noblesse, Patine et Longévité',
            slug: 'cuir-tanne-vegetal-patine',
            category: 'Matières Nobles',
            readTime: '6 min',
            date: '15 Septembre 2026',
            image: '/images/bags/baguette-terre-emeraude-2.jpg',
            excerpt:
                'Pourquoi nous refusons le tannage au chrome au profit d’extraits naturels d’écorces de mimosa et de châtaignier, garantissant une patine dorée unique au fil des ans.',
        },
        {
            title: 'Dans l’Atelier des Femmes Tisseuses de Bolgatanga',
            slug: 'femmes-tisseuses-bolgatanga',
            category: 'Héritage & Impact',
            readTime: '5 min',
            date: '08 Septembre 2026',
            image: '/images/artisan-hands.jpg',
            excerpt:
                'Rencontre avec Adwoa et ses compagnes de coopérative, gardiennes d’une méthode de tissage héritée de leurs aïeules qui révolutionne le luxe éthique.',
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-[#FAF8F5] dark:bg-[#140C06] transition-colors border-t border-[#E7DED0] dark:border-[#2C1D13]">
            <div className="vakaa-container space-y-12 sm:space-y-16">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-[#E7DED0] dark:border-[#2C1D13]">
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D] dark:text-[#D4A43C]">
                            Le Journal VAKÁA
                        </span>
                        <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                            Chroniques d&apos;Atelier
                        </h2>
                    </div>

                    <Link
                        href="/journal"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] transition-colors group cursor-pointer"
                    >
                        <span>Tous les récits</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                    </Link>
                </div>

                {/* 3 Column Article Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <article
                            key={article.slug}
                            className="group flex flex-col justify-between bg-white dark:bg-[#1C120A] rounded-2xl overflow-hidden border border-[#E7DED0]/90 dark:border-[#332216] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div>
                                {/* Article Image */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFE8DD] dark:bg-[#25170E]">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover object-center transition-transform duration-700 group-hover:scale-108"
                                    />
                                    {/* Category pill */}
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#180F08]/80 backdrop-blur-md border border-[#D4A43C]/40 text-[#D4A43C] text-[10px] font-bold uppercase tracking-wider">
                                        {article.category}
                                    </div>
                                </div>

                                {/* Article Body */}
                                <div className="p-6 sm:p-7 space-y-3">
                                    <div className="flex items-center gap-3 text-[11px] text-[#3A2418]/60 dark:text-[#E7DED0]/60">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-[#D4A43C]" />
                                            {article.readTime} de lecture
                                        </span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>

                                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] group-hover:text-[#D4A43C] transition-colors leading-snug">
                                        <Link href={`/journal`} className="cursor-pointer">
                                            {article.title}
                                        </Link>
                                    </h3>

                                    <p className="text-xs sm:text-sm text-[#3A2418]/75 dark:text-[#E7DED0]/70 leading-relaxed font-sans line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* Read Link Footer */}
                            <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2">
                                <Link
                                    href={`/journal`}
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] dark:text-[#D4A43C] hover:text-[#D4A43C] transition-colors cursor-pointer"
                                >
                                    <span>Lire l&apos;article</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
