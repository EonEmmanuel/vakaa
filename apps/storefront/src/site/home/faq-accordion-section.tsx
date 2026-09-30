'use client';

import {useState} from 'react';
import {ChevronDown, MessageCircle} from 'lucide-react';

export function FaqAccordionSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'Quels sont les délais et modalités de livraison internationale ?',
            answer:
                'Nous expédions l’ensemble de nos créations depuis nos ateliers vers plus de 40 pays via DHL Express et partenaires sécurisés. Comptez 2 à 4 jours ouvrés en Europe et Afrique de l’Ouest, et 3 à 6 jours pour les États-Unis et le reste du monde. Chaque colis est préparé dans un écrin de protection et muni d’un numéro de suivi temps réel.',
        },
        {
            question: 'Comment préserver et entretenir le raphia naturel et le cuir végétal ?',
            answer:
                'Le raphia sauvage est une fibre souple et naturellement robuste. En cas de poussière, un simple brossage délicat à l’aide d’un chiffon doux et sec suffit. Pour le cuir tanné aux extraits végétaux, appliquez une cire nourrissante incolore une à deux fois par an pour sublimer sa patine naturelle sans altérer sa teinte.',
        },
        {
            question: 'D’où proviennent les matières premières de vos créations ?',
            answer:
                'Nos fibres de raphia sont récoltées de façon éco-responsable dans les palmeraies côtières de Madagascar. Les cuirs sont sourcés auprès de tanneries certifiées utilisant des tannins d’écorces naturelles d’acacia et de mimosa. Enfin, notre bijouterie et nos fermoirs dorés sont fondus et sculptés artisanalement à Nairobi et Accra.',
        },
        {
            question: 'Quelle est la garantie de vos pièces et votre politique de retour ?',
            answer:
                'Toutes nos créations bénéficient d’une garantie atelier de 2 ans couvrant les défauts de fabrication et la bijouterie. Vous disposez également d’un délai de rétractation de 14 jours après réception pour un retour ou un échange gracieux, dès lors que la pièce est conservée dans son état neuf avec son sceau d’authenticité.',
        },
    ];

    const toggle = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section className="py-20 sm:py-24 bg-[#FAF8F5] dark:bg-[#140C06] transition-colors border-t border-[#E7DED0] dark:border-[#2C1D13]">
            <div className="vakaa-container max-w-4xl space-y-12 sm:space-y-16">
                {/* Header */}
                <div className="text-center space-y-3">
                    <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#A66B2D] dark:text-[#D4A43C]">
                        Questions Fréquentes
                    </span>
                    <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D120A] dark:text-[#F8F4EE] uppercase leading-tight">
                        Tout Savoir sur l&apos;Atelier VAKÁA
                    </h2>
                    <p className="text-sm sm:text-base text-[#3A2418]/75 dark:text-[#E7DED0]/70 max-w-xl mx-auto font-sans leading-relaxed">
                        Transparence, savoir-faire d&apos;exception et engagement durable au service de votre élégance.
                    </p>
                </div>

                {/* FAQ Cards Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className={`rounded-2xl transition-all duration-300 border ${
                                    isOpen
                                        ? 'bg-white dark:bg-[#1C120A] text-[#1D120A] dark:text-[#F8F4EE] border-[#A66B2D] shadow-md ring-1 ring-[#A66B2D]/20'
                                        : 'bg-white dark:bg-[#1C120A] text-[#1D120A] dark:text-[#F8F4EE] border-[#E7DED0] dark:border-[#332216] shadow-xs hover:border-[#A66B2D]/40'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    aria-expanded={isOpen}
                                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="font-sans text-base sm:text-lg font-bold pr-2 leading-snug">
                                        {faq.question}
                                    </span>
                                    <span
                                        className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-[#1D120A] text-[#F8F4EE] dark:bg-[#D4A43C] dark:text-[#140C06] rotate-180'
                                                : 'bg-[#FAF8F5] dark:bg-[#25170E] text-[#1D120A] dark:text-[#F8F4EE]'
                                        }`}
                                    >
                                        <ChevronDown className="size-4" />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-2 text-sm sm:text-[15px] leading-relaxed text-[#3A2418]/80 dark:text-[#E7DED0]/85 font-sans border-t border-[#E7DED0]/60 dark:border-white/10 animate-fade-up">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Concierge Helper Strip in Clean Whitish Style */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1C120A] border border-[#E7DED0] dark:border-[#332216] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
                    <div className="space-y-1">
                        <h4 className="font-sans text-base sm:text-lg font-bold text-[#1D120A] dark:text-[#F8F4EE]">
                            Une question spécifique sur une création ?
                        </h4>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#E7DED0]/70">
                            Notre Conciergerie Privée vous répond en direct pour un conseil personnalisé.
                        </p>
                    </div>

                    <a
                        href="https://wa.me/237677077594"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:-translate-y-0.5 shrink-0 cursor-pointer"
                    >
                        <MessageCircle className="size-4" />
                        <span>Contacter la Conciergerie</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
