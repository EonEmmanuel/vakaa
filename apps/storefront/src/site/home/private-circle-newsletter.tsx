'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { subscribeToNewsletter } from './subscribe-newsletter';

export function PrivateCircleNewsletter() {
    const [email, setEmail] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setHasError(false);
        startTransition(async () => {
            const res = await subscribeToNewsletter(email);
            if (res.ok) {
                setIsSubmitted(true);
            } else {
                setHasError(true);
            }
        });
    };

    return (
        <section className="px-3 pb-3 sm:px-5 sm:pb-5 bg-[#f2efe9] dark:bg-[#151413]">
            <div
                className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#FAF8F5] dark:bg-[#1a1917] text-[#1c1b18] dark:text-[#fbfaf7] border border-[#e2ddd2]/80 dark:border-white/10 shadow-tile grid md:grid-cols-2 items-stretch"
            >
                {/* Left Side: Editorial & Refined Form */}
                <div className="p-6 sm:p-10 lg:p-14 flex flex-col justify-center space-y-4 sm:space-y-6">
                    <div>
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#8C6D23] dark:text-[#D4A43C] font-semibold">
                            LE CERCLE PRIVÉ VAKAA
                        </span>
                        <h2 className="font-display mt-2 text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight text-[#1c1b18] dark:text-[#fbfaf7] leading-[1.12]">
                            Une note confidentielle lorsque l&apos;atelier dévoile une nouvelle capsule.
                        </h2>
                    </div>

                    <p className="text-[13.5px] sm:text-[14.5px] text-[#57544c] dark:text-[#a6a29a] font-sans leading-relaxed max-w-md">
                        Jamais plus de deux fois par mois. Accès prioritaire à nos pièces numérotées, invitations aux ventes privées et correspondances d&apos;artisanat.
                    </p>

                    {isSubmitted ? (
                        <div className="w-fit max-w-full flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-[#8C6D23]/10 dark:bg-[#D4A43C]/15 border border-[#8C6D23]/25 dark:border-[#D4A43C]/30 text-[#8C6D23] dark:text-[#D4A43C] text-xs sm:text-sm font-medium">
                            <span className="text-base leading-none mt-0.5">✓</span>
                            <span>Bienvenue dans le Cercle Privé Vakáa. Votre invitation est confirmée.</span>
                        </div>
                    ) : (
                        <div className="max-w-md space-y-2.5 pt-1">
                            {/* Unified Luxury Pill Form — stacked on small screens so input and button never crowd the pill edges */}
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl sm:rounded-full bg-white dark:bg-black/25 border border-[#d8d2c5] dark:border-white/15 p-2 sm:p-1.5 shadow-xs focus-within:border-[#8C6D23] dark:focus-within:border-[#D4A43C] focus-within:ring-2 focus-within:ring-[#8C6D23]/15 transition-all"
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@adresse.com"
                                    required
                                    className="flex-1 min-w-0 px-4 py-2.5 sm:py-2 bg-transparent text-[#1c1b18] dark:text-[#fbfaf7] placeholder:text-[#1c1b18]/40 dark:placeholder:text-[#fbfaf7]/40 text-[13.5px] sm:text-sm font-sans focus:outline-hidden"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center justify-center h-10 sm:h-11 w-full sm:w-auto px-5 sm:px-6 sm:ml-1.5 rounded-full bg-[#1c1b18] text-[#fbfaf7] dark:bg-[#fbfaf7] dark:text-[#1c1b18] hover:bg-[#8C6D23] dark:hover:bg-[#D4A43C] hover:text-[#fbfaf7] dark:hover:text-[#1c1b18] font-medium text-xs uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                                >
                                    {isPending ? '…' : (
                                        <span className="inline-flex items-center gap-1.5">
                                            <span>Rejoindre</span>
                                            <span className="text-[13px] leading-none">→</span>
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Discretion & Privacy Note */}
                            <p className="text-[11.5px] leading-snug text-[#7c766c] dark:text-[#8e8a82] font-sans">
                                ✦ Confidentialité absolue · Deux correspondances par mois · Désinscription en un clic
                            </p>

                            {hasError && (
                                <p className="text-xs text-[#c2410c] dark:text-[#e08a7c] font-sans">
                                    L&apos;inscription n&apos;a pas abouti pour le moment. Merci de réessayer plus tard.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Authentic Bolgatanga Artisan Workshop Photo */}
                <div className="relative h-56 sm:h-72 md:h-full min-h-[220px] md:min-h-[360px] w-full overflow-hidden bg-[#ebe4d8] dark:bg-[#24211d]">
                    <Image
                        src="/images/artisan-hands.jpg"
                        alt="Atelier Vakáa — Tissage artisanal à la main"
                        fill
                        className="object-cover object-center brightness-95 contrast-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#FAF8F5]/80 md:from-[#FAF8F5] via-[#FAF8F5]/10 md:via-transparent to-transparent dark:from-[#1a1917]/80 dark:md:from-[#1a1917] dark:via-[#1a1917]/10 dark:md:via-transparent pointer-events-none" />

                    {/* Subtle Craft Origin Tag — left side so it never collides */}
                    {/* with the fixed WhatsApp concierge in the bottom-right corner */}
                    <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[10.5px] font-mono uppercase tracking-[0.16em] text-white/90 shadow-xs pointer-events-none">
                        Bolgatanga · Façonné main
                    </div>
                </div>
            </div>
        </section>
    );
}
