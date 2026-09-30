import { getRouteLocale } from '@/platform/i18n/server';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    return {
        title: isFr ? 'Retours & Échanges | Maison VAKÁA' : 'Returns & Exchanges | Maison VAKÁA',
        description: isFr
            ? 'Politique de retours gracieux et d\'échanges sous 14 jours pour nos créations de maroquinerie artisanale.'
            : 'Explore our 14-day complimentary return and exchange policy for artisanal leather creations.',
    };
}

export async function ReturnsAndRefundsPage() {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';

    const steps = [
        {
            num: '01',
            title: isFr ? 'Notification sous 14 Jours' : '14-Day Notice',
            desc: isFr
                ? 'Contactez notre conciergerie à contact@vakaa.store ou via WhatsApp dans les 14 jours suivant la réception de votre pièce.'
                : 'Notify our concierge team at contact@vakaa.store or via WhatsApp within 14 days of delivery.',
        },
        {
            num: '02',
            title: isFr ? 'Contrôle & État Neuf' : 'Pristine Condition',
            desc: isFr
                ? 'La création doit être intacte, non portée, dans son dustbag d\'origine avec tous ses certificats et accessoires.'
                : 'The item must be unused, unblemished, with original tags, protective dustbag, and certificates intact.',
        },
        {
            num: '03',
            title: isFr ? 'Enlèvement ou Dépôt' : 'Pickup or Return Drop',
            desc: isFr
                ? 'À Douala et Yaoundé, un coursier VAKÁA peut récupérer le colis sur rendez-vous. Pour l\'international, un bordereau prépayé vous est transmis.'
                : 'In Douala and Yaounde, our private courier collects the package. Internationally, a prepaid return label is generated.',
        },
        {
            num: '04',
            title: isFr ? 'Remboursement ou Échange' : 'Instant Refund or Exchange',
            desc: isFr
                ? 'Dès inspection à l\'atelier sous 48h, nous procédons à l\'échange ou au remboursement direct sur votre compte Mobile Money ou carte bancaire.'
                : 'Upon atelier inspection within 48h, your refund is credited directly to your original Mobile Money or card account.',
        },
    ];

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Header Banner */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {isFr ? 'CONDITIONS DE RETOUR' : 'RETURN POLICY'}
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            {isFr ? 'Retours & Échanges' : 'Returns & Exchanges'}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            {isFr
                                ? 'Les retours et demandes d\'échange sont acceptés dans un délai de 14 jours civils suivant la réception de votre commande.'
                                : 'Returns and exchanges are accepted within 14 calendar days of receiving your order.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <div className="vakaa-container py-16 space-y-16">
                {/* 4 Steps Timeline */}
                <div className="space-y-8">
                    <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-center">
                        {isFr ? 'La Procédure en 4 Étapes Simples' : 'The 4-Step Return Process'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, idx) => (
                            <div key={idx} className="p-6 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] space-y-3 relative">
                                <div className="text-3xl font-sans font-bold text-[#D4A43C]/40">
                                    {s.num}
                                </div>
                                <h3 className="font-sans font-bold text-base text-[#1D120A] dark:text-[#F8F4EE]">
                                    {s.title}
                                </h3>
                                <p className="text-xs text-[#3A2418]/70 dark:text-[#F8F4EE]/70 leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] space-y-4">
                        <div className="flex items-center gap-3 text-green-600 dark:text-green-500 font-sans font-bold text-lg">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <span>{isFr ? 'Articles Éligibles aux Retours' : 'Eligible Items'}</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-[#3A2418]/80 dark:text-[#F8F4EE]/80 leading-relaxed list-disc list-inside">
                            <li>{isFr ? 'Pièces dans leur état neuf, non portées, non griffées' : 'Items in brand-new, unworn, unscratched condition'}</li>
                            <li>{isFr ? 'Dustbag en coton d\'origine et étiquettes intactes' : 'Original dustbag and packaging included'}</li>
                            <li>{isFr ? 'Demande effectuée dans le délai de 14 jours civils' : 'Return initiated within 14 calendar days of receipt'}</li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] space-y-4">
                        <div className="flex items-center gap-3 text-[#A66B2D] dark:text-[#D4A43C] font-sans font-bold text-lg">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{isFr ? 'Pièces Personnalisées & Sur-Mesure' : 'Custom & Bespoke Pieces'}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#3A2418]/80 dark:text-[#F8F4EE]/80 leading-relaxed">
                            {isFr
                                ? 'Les pièces personnalisées (gravure de monogrammes, finitions sur-mesure confectionnées à la demande) ne peuvent faire l\'objet d\'un remboursement, mais bénéficient de notre garantie de retouche gracieuse en cas de défaut.'
                                : 'Customized or bespoke engraved items tailored uniquely to client specifications cannot be refunded, but remain covered under our lifetime craftsmanship repair guarantee.'}
                        </p>
                    </div>
                </div>

                {/* Need Assistance */}
                <div className="p-6 sm:p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-sans font-bold text-base text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                            {isFr ? 'Une question sur un retour ?' : 'Questions about a return?'}
                        </h4>
                        <p className="text-xs text-[#3A2418]/70 dark:text-[#F8F4EE]/70">
                            {isFr
                                ? 'Contactez notre service client en indiquant votre référence de commande.'
                                : 'Contact our team with your order reference number for assistance.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href="https://wa.me/237677077594?text=Bonjour%20Maison%20VAKAA,%20je%20souhaite%20effectuer%20un%20retour."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#E7DED0] dark:border-[#3A291C] hover:border-[#25D366] text-[#3A2418] dark:text-[#F8F4EE] hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                            <span>WhatsApp</span>
                        </a>
                        <Link
                            href="/contact"
                            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] rounded-xs transition-colors whitespace-nowrap"
                        >
                            {isFr ? 'Nous Écrire' : 'Contact Us'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
