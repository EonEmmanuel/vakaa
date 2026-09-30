import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export function HeritageSavoirFaire() {
    const pillars = [
        { label: 'Raphia Sauvage', desc: 'Récolte éco-responsable à Madagascar' },
        { label: 'Cuirs Pleine Fleur', desc: 'Tannage végétal aux extraits de mimosa' },
        { label: 'Bouclerie Laiton', desc: 'Fermoirs et anneaux forgés à la main' },
    ];

    return (
        <section className="py-14 sm:py-20 bg-[#FAF8F5] text-[#1D120A] transition-colors border-b border-[#E7DED0]/70">
            <div className="vakaa-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    
                    {/* Left: Magazine Pedestal Photography */}
                    <div className="lg:col-span-6 relative">
                        <div className="relative aspect-[4/4] sm:aspect-[16/11] lg:aspect-[4/4] w-full rounded-3xl overflow-hidden bg-white ring-1 ring-[#E7DED0] shadow-sm group">
                            <Image
                                src="/images/artisan-hands.jpg"
                                alt="Maître artisan tissant un sac de luxe en raphia naturel et cuir"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1D120A]/70 via-transparent to-transparent opacity-80" />

                            {/* Floating artisan seal */}
                            <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-between shadow-xs ring-1 ring-[#E7DED0]">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-[#A66B2D] font-bold">
                                        Atelier Bolgatanga & Nairobi
                                    </p>
                                    <p className="text-xs text-[#1D120A] font-semibold mt-0.5">
                                        48+ heures de confection patiente par sac
                                    </p>
                                </div>
                                <span className="size-8 rounded-full bg-[#FAF8F5] ring-1 ring-[#E7DED0] text-[#A66B2D] flex items-center justify-center shrink-0">
                                    <ShieldCheck className="size-4" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Concise Editorial Storytelling & Direct CTA */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-2.5">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F2ECE4] border border-[#E7DED0]/70 text-[10px] sm:text-[11px] font-semibold text-[#8C5824]">
                                <span>Savoir-Faire & Transmission</span>
                            </div>
                            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                                L&apos;Âme Africaine dans Chaque Point
                            </h2>
                            <p className="text-xs sm:text-sm text-[#3A2418]/75 leading-relaxed font-sans pt-1">
                                Façonnés à la main dans nos ateliers partenaires, nos sacs marient raphia sauvage et cuirs nobles au tannage végétal pour créer des pièces pérennes, poétiques et engagées.
                            </p>
                        </div>

                        {/* 3 Signature Material Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {pillars.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl bg-white ring-1 ring-[#E7DED0]/80 shadow-2xs space-y-1"
                                >
                                    <h3 className="font-sans text-xs font-bold text-[#1D120A] tracking-tight">
                                        {item.label}
                                    </h3>
                                    <p className="text-[10px] text-[#3A2418]/65 leading-snug">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Direct CTAs */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link
                                href="/our-story"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] transition-all shadow-xs hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                            >
                                <span>L&apos;Histoire de l&apos;Atelier</span>
                                <ArrowRight className="size-3.5" />
                            </Link>

                            <Link
                                href="/artisans"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1D120A] hover:text-[#A66B2D] bg-white ring-1 ring-[#E7DED0] hover:ring-[#D4A43C]/60 transition-all cursor-pointer hover:-translate-y-0.5"
                            >
                                <span>Rencontrer les Artisans</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
