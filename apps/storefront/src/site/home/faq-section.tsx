'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQS: FAQItem[] = [
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

    // Schema.org FAQPage structured data for Google rich snippets
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
        <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#E7DED0]/60 transition-colors">
            {/* Embedded Schema.org JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="vakaa-container max-w-4xl space-y-10 sm:space-y-14">
                
                {/* Section Header */}
                <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66B2D]">
                        FAQ & Renseignements
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                        Une Question ? <span className="text-[#A66B2D]">Nous Vous Éclairons</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#3A2418]/70 font-sans leading-relaxed pt-1">
                        Tout ce que vous devez savoir sur la confection, nos garanties et vos commandes.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-3 sm:space-y-4">
                    {FAQS.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl transition-all duration-200 border ${
                                    isOpen
                                        ? 'bg-[#F3EFE9] border-[#E7DED0] shadow-xs'
                                        : 'bg-white/80 border-[#E7DED0]/70 hover:border-[#D4A43C]/50'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    aria-expanded={isOpen}
                                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="font-sans text-xs sm:text-sm md:text-base font-semibold text-[#1D120A] tracking-tight">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`size-7 sm:size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                            isOpen
                                                ? 'bg-[#1D120A] text-[#FAF8F5]'
                                                : 'bg-[#F3EFE9] text-[#1D120A]'
                                        }`}
                                    >
                                        {isOpen ? (
                                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        ) : (
                                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                        )}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 animate-fade-in">
                                        <div className="border-t border-[#E7DED0]/60 pt-3">
                                            <p className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed font-sans">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Direct Concierge Prompt */}
                <div className="pt-2 text-center">
                    <p className="text-xs sm:text-sm text-[#3A2418]/70">
                        Vous avez une question spécifique sur une commande ou personnalisation ?{' '}
                        <a
                            href="https://wa.me/237699000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#A66B2D] hover:underline underline-offset-4"
                        >
                            Échangez directement avec notre concierge WhatsApp &rarr;
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
}
