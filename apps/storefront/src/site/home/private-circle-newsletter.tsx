'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { subscribeToNewsletter } from './subscribe-newsletter';

export function PrivateCircleNewsletter() {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !consent) return;

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
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[#1c1b18] text-[#fbfaf7] border border-black/5 dark:border-white/10 shadow-tile grid md:grid-cols-2 items-center"
            >
                {/* Left Side: Editorial & Form */}
                <div className="p-7 sm:p-10 lg:p-14 space-y-5 sm:space-y-6">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#D4A43C] font-semibold">
                        LE CERCLE PRIVÉ VAKAA
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-bold tracking-tight text-[#fbfaf7] leading-[1.12]">
                        Une note confidentielle lorsque l&apos;atelier dévoile une nouvelle capsule.
                    </h2>
                    <p className="text-[13.5px] sm:text-[14.5px] text-[#fbfaf7]/70 font-sans leading-relaxed max-w-md">
                        Jamais plus de deux fois par mois. Accès prioritaire à nos pièces numérotées et invitations aux ventes privées.
                    </p>

                    {isSubmitted ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#D4A43C]/15 border border-[#D4A43C]/30 text-[#D4A43C] text-xs sm:text-sm font-medium">
                            <span className="text-[#D4A43C]">✓</span>
                            <span>Bienvenue dans le Cercle Privé Vakaa.</span>
                        </div>
                    ) : (
                        <div className="max-w-md pt-1 space-y-2.5">
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@adresse.com"
                                    required
                                    className="flex-1 h-11 sm:h-12 px-4 rounded-full bg-white/10 border border-white/15 text-[#fbfaf7] placeholder:text-[#fbfaf7]/40 text-sm focus:outline-hidden focus:border-[#D4A43C] transition-colors font-sans"
                                />
                                <button
                                    type="submit"
                                    disabled={!consent || isPending}
                                    className="h-11 sm:h-12 px-6 rounded-full bg-[#fbfaf7] text-[#1c1b18] hover:bg-[#D4A43C] hover:text-[#1c1b18] font-medium text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50 disabled:hover:bg-[#fbfaf7] disabled:hover:text-[#1c1b18]"
                                >
                                    {isPending ? '…' : 'Rejoindre'}
                                </button>
                            </form>
                            <label className="flex items-start gap-2 text-[11px] leading-snug text-[#fbfaf7]/60 font-sans cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-0.5 accent-[#D4A43C] cursor-pointer"
                                />
                                <span>
                                    J&apos;accepte de recevoir les e-mails du Cercle Privé Vakaa et je peux me
                                    désinscrire à tout moment.
                                </span>
                            </label>
                            {hasError && (
                                <p className="text-xs text-[#e08a7c] font-sans">
                                    L&apos;inscription n&apos;a pas abouti pour le moment. Merci de réessayer plus
                                    tard.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Artisan Workshop / Atmosphere Photo */}
                <div className="relative h-64 sm:h-80 md:h-full min-h-[260px] md:min-h-[360px] w-full overflow-hidden bg-[#24211d]">
                    <Image
                        src="/images/hero-model.jpg"
                        alt="Atelier Vakaa — Savoir-Faire"
                        fill
                        className="object-cover object-center brightness-90 contrast-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1c1b18] via-[#1c1b18]/40 to-transparent" />
                </div>
            </motion.div>
        </section>
    );
}
