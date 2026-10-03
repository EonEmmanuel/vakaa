'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "Comment sont fabriqués les sacs et accessoires VAKÁA ?",
        answer: "Chaque pièce est entièrement confectionnée à la main dans nos ateliers partenaires de Bolgatanga et Nairobi. Nos maîtres artisans associent le tressage méticuleux de raphia sauvage renouvelable à des cuirs nobles pleine fleur tannés aux extraits végétaux de mimosa et d'acacia. Plus de 48 heures de travail patient sont consacrées à chaque création.",
    },
    {
        question: "Quels sont les délais et zones de livraison ?",
        answer: "Nous expédions au Cameroun (Douala et Yaoundé en 24-48h par coursier privé) et dans le monde entier via DHL Express avec suivi en temps réel (3 à 5 jours ouvrés vers l'Europe, l'Afrique et l'Amérique du Nord). La livraison est offerte dès 100 000 FCFA (150 € / $165) d'achat.",
    },
    {
        question: "Quels moyens de paiement sont acceptés ?",
        answer: "Pour vous offrir un confort absolu, nous acceptons les paiements sécurisés par Mobile Money (MTN MoMo, Orange Money), les cartes bancaires internationales (Visa, Mastercard, American Express) via nos passerelles chiffrées, ainsi que les virements bancaires directs.",
    },
    {
        question: "Comment entretenir le raphia naturel et le cuir noble ?",
        answer: "Pour préserver la splendeur de votre sac, conservez-le à l'abri de l'humidité excessive et du soleil direct prolongé. Pour le cuir pleine fleur, appliquez occasionnellement une cire nourrissante incolore. Le raphia peut être délicatement dépoussiéré à l'aide d'un chiffon doux et sec.",
    },
    {
        question: "Quelle est votre politique de retour et d'échange ?",
        answer: "Si votre création ne correspond pas parfaitement à vos attentes, vous disposez de 14 jours calendaires à compter de la réception de votre colis pour demander un échange gracieux ou un remboursement complet, sous réserve que l'article soit dans son état neuf avec son pochon d'origine.",
    },
];

export function FaqSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIdx(openIdx === idx ? null : idx);
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <section className="py-24 sm:py-32 bg-[#FAF8F5]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="vakaa-container">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left: Heading 40% (approx 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66B2D]">
                            FAQ
                        </span>
                        <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#1D120A] tracking-tight leading-none">
                            Questions Fréquentes
                        </h2>
                    </div>

                    {/* Right: Accordion 60% (approx 7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openIdx === idx;
                            return (
                                <div key={idx} className="border-b border-[#E7DED0] pb-8">
                                    <button
                                        type="button"
                                        onClick={() => toggle(idx)}
                                        className="w-full flex items-start justify-between gap-6 text-left cursor-pointer"
                                    >
                                        <h3 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] pr-8">
                                            {faq.question}
                                        </h3>
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                            className="shrink-0 mt-1"
                                        >
                                            <ChevronDown className="w-5 h-5 text-[#A66B2D]" />
                                        </motion.div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pt-6 text-base text-[#3A2418]/70 leading-relaxed font-sans">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
