'use client';

import { useState } from 'react';
import { Star, ShieldCheck, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

interface ProductTabsProps {
    description: string;
    productName: string;
}

export function ProductTabs({ description, productName }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

    const specifications = [
        { feature: 'Matière Principale', detail: 'Raphia sauvage naturel d’Afrique, tissé à la main' },
        { feature: 'Cuir & Finitions', detail: 'Cuir de vachette pleine fleur à tannage 100% végétal' },
        { feature: 'Bouclerie & Garnitures', detail: 'Laiton massif patiné, forgé artisanalement' },
        { feature: 'Dimensions Estimées', detail: 'Format étudié (H 32 cm × L 40 cm × P 14 cm)' },
        { feature: 'Poids Léger', detail: 'Environ 650 g (ergonomique et résistant)' },
        { feature: 'Origine de Confection', detail: 'Ateliers d’Afrique de l’Ouest & Centrale' },
        { feature: 'Accessoires Fournis', detail: 'Pochette de protection dustbag en coton biologique VAKÁA' },
        { feature: 'Entretien', detail: 'Nourrir le cuir au baume naturel, préserver de l’humidité prolongée' },
    ];

    const reviews = [
        {
            author: 'Aïssatou D.',
            location: 'Dakar & Paris',
            rating: 5,
            date: 'Il y a 2 semaines',
            title: 'Un chef-d’œuvre d’artisanat',
            comment: 'La qualité du raphia et les finitions en cuir sont exceptionnelles. Le sac attire tous les regards, tout en étant léger et très spacieux. C’est du vrai luxe africain contemporain.',
        },
        {
            author: 'Marc-Antoine B.',
            location: 'Douala',
            rating: 5,
            date: 'Il y a 1 mois',
            title: 'Cadeau somptueux',
            comment: 'Offert pour l’anniversaire de mon épouse. L’emballage soigné, la signature d’atelier et l’odeur du cuir pleine fleur font toute la différence. Livraison express en 24h très appréciée.',
        },
        {
            author: 'Khadija M.',
            location: 'Abidjan',
            rating: 5,
            date: 'Il y a 1 mois',
            title: 'Élégance et authenticité',
            comment: 'Le tressage est d’une régularité incroyable. On sent le temps et l’amour investis par les artisans dans cette pièce. Je recommande sans hésiter !',
        },
    ];

    return (
        <section className="mt-16 sm:mt-20 pt-10 border-t border-[#E7DED0]/80">
            {/* Horizontal Tabs Header (FutureCommerce style) */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 border-b border-[#E7DED0]">
                <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 text-sm sm:text-base font-semibold tracking-tight transition-all cursor-pointer relative ${
                        activeTab === 'description'
                            ? 'text-[#1D120A] font-bold'
                            : 'text-[#3A2418]/60 hover:text-[#1D120A]'
                    }`}
                >
                    <span>Description</span>
                    {activeTab === 'description' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A43C] rounded-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('specifications')}
                    className={`pb-4 text-sm sm:text-base font-semibold tracking-tight transition-all cursor-pointer relative ${
                        activeTab === 'specifications'
                            ? 'text-[#1D120A] font-bold'
                            : 'text-[#3A2418]/60 hover:text-[#1D120A]'
                    }`}
                >
                    <span>Spécifications & Matières</span>
                    {activeTab === 'specifications' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A43C] rounded-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 text-sm sm:text-base font-semibold tracking-tight transition-all cursor-pointer relative ${
                        activeTab === 'reviews'
                            ? 'text-[#1D120A] font-bold'
                            : 'text-[#3A2418]/60 hover:text-[#1D120A]'
                    }`}
                >
                    <span>Avis & Savoir-Faire (28)</span>
                    {activeTab === 'reviews' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A43C] rounded-full" />
                    )}
                </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'description' && (
                <div className="pt-8 max-w-4xl mx-auto space-y-6">
                    <div
                        className="prose prose-sm sm:prose-base max-w-none text-[#3A2418]/85 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                    
                    {/* Artisanal Heritage Callout */}
                    <div className="mt-8 p-6 rounded-2xl bg-[#F3EFE9] border border-[#E7DED0]/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="size-12 rounded-xl bg-[#D4A43C]/15 flex items-center justify-center shrink-0 text-[#A66B2D]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-sans text-sm font-bold text-[#1D120A]">
                                Chaque Pièce Raconte Une Histoire Unique
                            </h4>
                            <p className="text-xs sm:text-sm text-[#3A2418]/70 leading-relaxed">
                                En raison du travail 100% manuel du raphia naturel et du cuir à patine végétale, d’infimes nuances de texture et de teinte rendent chaque exemplaire rigoureusement exclusif.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Additional Information (Two-tone feature table matching ff98ca... reference) */}
            {activeTab === 'specifications' && (
                <div className="pt-8 max-w-3xl mx-auto">
                    <div className="overflow-hidden rounded-2xl border border-[#E7DED0] shadow-xs">
                        <div className="grid grid-cols-12 bg-[#D4A43C] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-5">
                            <div className="col-span-5 sm:col-span-4">Caractéristique</div>
                            <div className="col-span-7 sm:col-span-8">Détails d’Atelier</div>
                        </div>

                        <div className="divide-y divide-[#E7DED0]/70 text-xs sm:text-sm font-sans">
                            {specifications.map((row, idx) => (
                                <div
                                    key={row.feature}
                                    className={`grid grid-cols-12 py-3.5 px-5 transition-colors ${
                                        idx % 2 === 0 ? 'bg-[#FAF8F5]' : 'bg-[#F3EFE9]/60'
                                    }`}
                                >
                                    <div className="col-span-5 sm:col-span-4 font-semibold text-[#1D120A]">
                                        {row.feature}
                                    </div>
                                    <div className="col-span-7 sm:col-span-8 text-[#3A2418]/80 leading-relaxed">
                                        {row.detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
                <div className="pt-8 max-w-4xl mx-auto space-y-8">
                    {/* Score Summary Box */}
                    <div className="p-6 rounded-2xl bg-[#F3EFE9] border border-[#E7DED0]/70 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl sm:text-5xl font-extrabold text-[#1D120A] tracking-tight">
                                5.0
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1 text-[#D4A43C]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="size-4.5 fill-[#D4A43C]" />
                                    ))}
                                </div>
                                <p className="text-xs text-[#3A2418]/70 font-medium">
                                    Basé sur 28 avis vérifiés d’acheteurs VAKÁA
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E7DED0] text-xs font-semibold text-[#1D120A] shadow-xs">
                            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                            <span>100% Avis Vérifiés par Tiers</span>
                        </div>
                    </div>

                    {/* Review Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {reviews.map((rev, i) => (
                            <div
                                key={i}
                                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7DED0] flex flex-col justify-between space-y-3"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[#D4A43C]">
                                            {Array.from({ length: rev.rating }).map((_, r) => (
                                                <Star key={r} className="size-3.5 fill-[#D4A43C]" />
                                            ))}
                                        </div>
                                        <span className="text-[11px] text-[#3A2418]/50">{rev.date}</span>
                                    </div>
                                    <h5 className="font-sans text-xs sm:text-sm font-bold text-[#1D120A]">
                                        {rev.title}
                                    </h5>
                                    <p className="text-xs text-[#3A2418]/75 leading-relaxed">
                                        « {rev.comment} »
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-[#E7DED0]/60 flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-[#1D120A]">{rev.author}</span>
                                    <span className="text-[#3A2418]/50">{rev.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
