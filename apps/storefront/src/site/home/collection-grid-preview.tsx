import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export function CollectionGridPreview() {
    return (
        <section className="py-16 sm:py-24 bg-[#FAF8F5] transition-colors border-b border-[#E7DED0]/60">
            <div className="vakaa-container space-y-10 sm:space-y-14">
                
                {/* Section Header with Refined Typography & Spacing */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5 max-w-xl">
                        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A66B2D]">
                            Lignes Emblématiques
                        </span>
                        <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                            Explorez Nos Catégories de Sacs
                        </h2>
                    </div>

                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1D120A] hover:text-[#A66B2D] transition-colors py-1 cursor-pointer"
                    >
                        <span>Voir tout le catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* ═══ Asymmetric Bento Category Layout (Seamless Pillowed Cards) ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
                    
                    {/* Left Feature Card: Cabas & Tote Bags */}
                    <div className="lg:col-span-6 relative rounded-3xl overflow-hidden bg-[#F3EFE9] shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 group flex flex-col justify-between p-6 sm:p-8 min-h-[340px] sm:min-h-[460px]">
                        <div className="relative z-10 space-y-2.5 max-w-sm">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#A66B2D]">
                                12+ Modèles Exclusifs
                            </span>
                            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-[#1D120A] tracking-tight leading-tight">
                                Sacs Cabas & Totes
                            </h3>
                            <p className="text-xs sm:text-sm text-[#3A2418]/75 leading-relaxed font-sans">
                                Volumes généreux, cuir tanné végétal et tressage ancestral de raphia naturel pour vos journées d&apos;exception.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/search?category=tote-bags"
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] group-hover:text-[#A66B2D] transition-colors cursor-pointer"
                                >
                                    <span>Découvrir la collection</span>
                                    <span className="size-7 rounded-full bg-[#1D120A] text-[#FAF8F5] group-hover:bg-[#A66B2D] flex items-center justify-center transition-colors">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Image anchoring the bottom */}
                        <div className="relative w-full aspect-[16/10] mt-4 rounded-2xl overflow-hidden shadow-xs">
                            <Image
                                src="/images/bags/maa-tote.jpg"
                                alt="Sacs Cabas VAKAA"
                                fill
                                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right Stack: 2 Cards (Shoulder Bags Top, Clutches Bottom) */}
                    <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 lg:gap-8">
                        
                        {/* Top Right Card: Shoulder Bags */}
                        <div className="relative rounded-3xl overflow-hidden bg-[#F3EFE9] shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 group flex-1 p-5 sm:p-7 flex flex-row items-center justify-between gap-4">
                            <div className="space-y-2 max-w-xs">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#A66B2D]">
                                    8+ Modèles
                                </span>
                                <h3 className="font-sans text-lg sm:text-2xl font-bold text-[#1D120A] tracking-tight">
                                    Porté Épaule & Baguettes
                                </h3>
                                <p className="text-xs text-[#3A2418]/70 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                                    Silhouettes fuselées et bandoulières ergonomiques pour une allure citadine affirmée.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href="/search?category=shoulder-bags"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] hover:text-[#A66B2D] transition-colors cursor-pointer"
                                    >
                                        <span>Explorer</span>
                                        <span className="size-6 sm:size-7 rounded-full bg-[#1D120A] text-[#FAF8F5] group-hover:bg-[#A66B2D] flex items-center justify-center transition-colors">
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative w-28 sm:w-40 md:w-44 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-xs">
                                <Image
                                    src="/images/bags/baguette-indigo-savane-1.jpg"
                                    alt="Sacs Porté Épaule VAKAA"
                                    fill
                                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                    sizes="(max-width: 640px) 120px, 20vw"
                                />
                            </div>
                        </div>

                        {/* Bottom Right Card: Clutches & Evening Bags */}
                        <div className="relative rounded-3xl overflow-hidden bg-[#F3EFE9] shadow-xs hover:shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 group flex-1 p-5 sm:p-7 flex flex-row items-center justify-between gap-4">
                            <div className="space-y-2 max-w-xs">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-[#A66B2D]">
                                    6+ Pièces Bijoux
                                </span>
                                <h3 className="font-sans text-lg sm:text-2xl font-bold text-[#1D120A] tracking-tight">
                                    Pochettes & Minaudières
                                </h3>
                                <p className="text-xs text-[#3A2418]/70 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                                    Bouclerie en laiton patiné et format bijou pour sublimer vos soirées et cérémonies.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href="/search?category=clutches"
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D120A] hover:text-[#A66B2D] transition-colors cursor-pointer"
                                    >
                                        <span>Explorer</span>
                                        <span className="size-6 sm:size-7 rounded-full bg-[#1D120A] text-[#FAF8F5] group-hover:bg-[#A66B2D] flex items-center justify-center transition-colors">
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative w-28 sm:w-40 md:w-44 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-xs">
                                <Image
                                    src="/images/bags/zuri-clutch.jpg"
                                    alt="Pochettes de Soirée VAKAA"
                                    fill
                                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                    sizes="(max-width: 640px) 120px, 20vw"
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
