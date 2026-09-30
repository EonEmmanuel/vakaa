import { getRouteLocale } from '@/platform/i18n/server';
import { Truck, ShieldCheck, Clock, Globe, PackageCheck, HelpCircle } from "lucide-react";
import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    return {
        title: isFr ? 'Livraison & Expédition | Maison VAKÁA' : 'Shipping & Delivery | Maison VAKÁA',
        description: isFr 
            ? 'Découvrez nos délais, modes de livraison sécurisés et tarifs d\'expédition à Douala, Yaoundé, en Afrique et dans le monde.'
            : 'Explore our shipping times, insured courier methods, and rates across Cameroon, Africa, and worldwide.',
    };
}

export async function ShippingAndDeliveryPage() {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';

    const shippingZones = [
        {
            zone: isFr ? 'Cameroun — Douala & Yaoundé' : 'Cameroon — Douala & Yaounde',
            delay: isFr ? '24 à 48 heures' : '24 to 48 hours',
            carrier: isFr ? 'Coursier Express Privé VAKÁA' : 'VAKÁA Private Express Courier',
            rate: isFr ? '2 000 FCFA (Offerte dès 75 000 FCFA)' : '2,000 XAF (Free over 75,000 XAF)',
            detail: isFr ? 'Livraison sur rendez-vous à domicile ou sur votre lieu de travail.' : 'Scheduled delivery directly to your home or office.',
        },
        {
            zone: isFr ? 'Cameroun — Villes Régionales' : 'Cameroon — Regional Cities',
            delay: isFr ? '48 à 72 heures' : '48 to 72 hours',
            carrier: isFr ? 'Partenaires de Messagerie Sécurisée' : 'Insured Freight & Courier Partners',
            rate: isFr ? '3 500 FCFA' : '3,500 XAF',
            detail: isFr ? 'Bafoussam, Garoua, Bamenda, Kribi, Limbe, etc.' : 'Bafoussam, Garoua, Bamenda, Kribi, Limbe, etc.',
        },
        {
            zone: isFr ? 'Afrique Centrale & Ouest (CEMAC / CEDEAO)' : 'Central & West Africa (CEMAC / ECOWAS)',
            delay: isFr ? '3 à 5 jours ouvrés' : '3 to 5 business days',
            carrier: isFr ? 'DHL Express / Fret Aérien Sécurisé' : 'DHL Express / Air Freight',
            rate: isFr ? 'À partir de 15 000 FCFA (~$25)' : 'From 15,000 XAF (~$25)',
            detail: isFr ? 'Côte d\'Ivoire, Sénégal, Gabon, Congo, Bénin, Togo, etc.' : 'Ivory Coast, Senegal, Gabon, Congo, Benin, Togo, etc.',
        },
        {
            zone: isFr ? 'International (Europe, Amériques, Reste du Monde)' : 'International (Europe, Americas, Rest of World)',
            delay: isFr ? '4 à 7 jours ouvrés' : '4 to 7 business days',
            carrier: 'DHL Express Worldwide',
            rate: isFr ? 'Calculé selon destination (~$35 - $45)' : 'Calculated at checkout (~$35 - $45)',
            detail: isFr ? 'Numéro de suivi en direct et dédouanement prioritaire inclus.' : 'Live tracking number and priority customs clearance included.',
        },
    ];

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Header Banner */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {isFr ? 'POLITIQUE DE LIVRAISON' : 'SHIPPING POLICY'}
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            {isFr ? 'Livraison & Expédition' : 'Shipping & Delivery'}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            {isFr 
                                ? 'Chaque création VAKÁA est préparée avec soin et expédiée sous emballage scellé avec suivi en direct.'
                                : 'Each VAKÁA creation is carefully prepared and dispatched in sealed packaging with live tracking.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <div className="vakaa-container py-16 space-y-16">
                {/* 3 Trust Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-xs space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Colis Assurés & Scellés' : 'Insured & Sealed Parcels'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70 leading-relaxed">
                            {isFr
                                ? 'Chaque envoi est entièrement assuré jusqu\'à sa remise en mains propres contre signature.'
                                : 'Every shipment is fully insured until safely handed over with signature confirmation.'}
                        </p>
                    </div>

                    <div className="p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-xs space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Suivi en Temps Réel' : 'Real-Time Tracking'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70 leading-relaxed">
                            {isFr
                                ? 'Dès que votre sac quitte nos ateliers, vous recevez un SMS et un e-mail avec votre numéro de suivi direct.'
                                : 'As soon as your creation leaves our atelier, you receive an email and SMS with direct tracking details.'}
                        </p>
                    </div>

                    <div className="p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-xs space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <PackageCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Écrin & Pochon VAKÁA' : 'Luxury Packaging'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70 leading-relaxed">
                            {isFr
                                ? 'Livré dans un dustbag en coton biologique protecteur avec certificat d\'authenticité artisanal.'
                                : 'Delivered in an organic cotton protective dustbag with an artisanal certificate of authenticity.'}
                        </p>
                    </div>
                </div>

                {/* Shipping Zones Table */}
                <div className="bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] rounded-sm p-6 sm:p-10 space-y-8">
                    <div className="space-y-2">
                        <h2 className="font-sans text-2xl font-bold uppercase tracking-wide">
                            {isFr ? 'Grille des Délais & Tarifs par Destination' : 'Delivery Times & Rates by Destination'}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70">
                            {isFr 
                                ? 'Les délais s\'appliquent à compter de la confirmation et préparation de la commande en atelier.'
                                : 'Delivery time estimates begin once your order has been prepared and inspected.'}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-[#E7DED0] dark:border-[#3A291C] text-[#D4A43C] uppercase text-[11px] tracking-wider font-semibold">
                                    <th className="py-4 pr-4">{isFr ? 'Zone de Livraison' : 'Destination'}</th>
                                    <th className="py-4 px-4">{isFr ? 'Délai Moyen' : 'Estimated Time'}</th>
                                    <th className="py-4 px-4">{isFr ? 'Transporteur' : 'Carrier'}</th>
                                    <th className="py-4 pl-4">{isFr ? 'Tarif Estimatif' : 'Estimated Rate'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7DED0]/60 dark:divide-[#3A291C]/60">
                                {shippingZones.map((z, idx) => (
                                    <tr key={idx} className="hover:bg-[#F8F4EE]/50 dark:hover:bg-[#140C06]/40 transition-colors">
                                        <td className="py-4 pr-4 font-semibold text-[#1D120A] dark:text-[#F8F4EE]">
                                            <div>{z.zone}</div>
                                            <div className="text-[11px] text-[#A66B2D] dark:text-[#D4A43C] font-normal mt-0.5">{z.detail}</div>
                                        </td>
                                        <td className="py-4 px-4">{z.delay}</td>
                                        <td className="py-4 px-4 text-[#3A2418]/80 dark:text-[#F8F4EE]/80">{z.carrier}</td>
                                        <td className="py-4 pl-4 font-bold text-[#1D120A] dark:text-[#F8F4EE] whitespace-nowrap">{z.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Need Help Box */}
                <div className="p-6 sm:p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-sans font-bold text-base text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                            {isFr ? 'Une question sur votre expédition ?' : 'Questions about your shipment?'}
                        </h4>
                        <p className="text-xs text-[#3A2418]/70 dark:text-[#F8F4EE]/70">
                            {isFr 
                                ? 'Notre équipe vous renseigne directement sur les modalités de livraison.'
                                : 'Our team is available to assist with delivery arrangements and tracking.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            href="/track-order" 
                            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#E7DED0] dark:border-[#3A291C] hover:border-[#1D120A] dark:hover:border-[#F8F4EE] text-[#1D120A] dark:text-[#F8F4EE] transition-colors whitespace-nowrap"
                        >
                            {isFr ? 'Suivre mon colis' : 'Track Order'}
                        </Link>
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
