'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function PrivateCircleNewsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setIsSubmitted(true);
    };

    return (
        <section className="py-24 sm:py-32 bg-[#1D120A] text-[#FAF8F5]">
            <div className="vakaa-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    className="max-w-3xl mx-auto text-center space-y-12"
                >
                    <div className="space-y-6">
                        <h2 className="font-sans text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight uppercase leading-none">
                            Join the Private Circle
                        </h2>
                        <p className="text-sm sm:text-base text-white/60 font-sans max-w-lg mx-auto">
                            Recevez en avant-première nos capsules numérotées, lancements d'ateliers et invitations exclusives.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-[#D4A43C] font-semibold tracking-wider text-sm">
                            Votre invitation privée a été transmise. Bienvenue dans le Cercle.
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row items-end justify-center gap-6 max-w-xl mx-auto"
                        >
                            <div className="w-full">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="VOTRE ADRESSE EMAIL"
                                    required
                                    className="w-full bg-transparent border-b border-white/30 text-white placeholder:text-white/30 pb-3 text-sm focus:outline-hidden focus:border-[#D4A43C] transition-colors rounded-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#D4A43C] text-[#1D120A] font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-white transition-colors shrink-0 cursor-pointer"
                            >
                                Souscrire
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
