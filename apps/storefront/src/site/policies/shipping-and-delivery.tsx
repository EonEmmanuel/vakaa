import { getRouteLocale } from '@/platform/i18n/server';
import { Truck, ShieldCheck, Clock, Globe, PackageCheck, HelpCircle } from "lucide-react";
import type { Metadata } from 'next';
import { Link } from '@/platform/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    const isDe = locale === 'de';
    return {
        title: isFr ? 'Livraison & Expédition | Maison VAKÁA' : isDe ? 'Versand & Lieferung | Maison VAKÁA' : 'Shipping & Delivery | Maison VAKÁA',
        description: isFr
            ? 'Découvrez nos délais, modes de livraison sécurisés et tarifs d\'expédition à Douala, Yaoundé, en Afrique et dans le monde.'
            : isDe
            ? 'Entdecken Sie unsere Lieferzeiten, versicherten Versandmethoden und Tarife in Kamerun, Afrika und weltweit.'
            : 'Explore our shipping times, insured courier methods, and rates across Cameroon, Africa, and worldwide.',
    };
}

export async function ShippingAndDeliveryPage() {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    const isDe = locale === 'de';

    const shippingZones = [
        {
            zone: isFr ? 'Cameroun — Douala & Yaoundé' : isDe ? 'Kamerun — Douala & Jaunde' : 'Cameroon — Douala & Yaounde',
            delay: isFr ? '24 à 48 heures' : isDe ? '24 bis 48 Stunden' : '24 to 48 hours',
            carrier: isFr ? 'Coursier Express Privé VAKÁA' : isDe ? 'VAKÁA Privater Express-Kurier' : 'VAKÁA Private Express Courier',
            rate: isFr ? '2 000 FCFA (Offerte dès 100 000 FCFA)' : isDe ? '2.000 XAF (Kostenlos ab 100.000 XAF)' : '2,000 XAF (Free over 100,000 XAF)',
            detail: isFr ? 'Livraison sur rendez-vous à domicile ou sur votre lieu de travail.' : isDe ? 'Lieferung nach Terminabsprache nach Hause oder ins Büro.' : 'Scheduled delivery directly to your home or office.',
        },
        {
            zone: isFr ? 'Cameroun — Villes Régionales' : isDe ? 'Kamerun — Regionale Städte' : 'Cameroon — Regional Cities',
            delay: isFr ? '48 à 72 heures' : isDe ? '48 bis 72 Stunden' : '48 to 72 hours',
            carrier: isFr ? 'Partenaires de Messagerie Sécurisée' : isDe ? 'Versicherte Fracht- und Kurierpartner' : 'Insured Freight & Courier Partners',
            rate: isFr ? '3 500 FCFA' : isDe ? '3.500 XAF' : '3,500 XAF',
            detail: 'Bafoussam, Garoua, Bamenda, Kribi, Limbe, etc.',
        },
        {
            zone: isFr ? 'Afrique Centrale & Ouest (CEMAC / CEDEAO)' : isDe ? 'Zentral- & Westafrika (CEMAC / ECOWAS)' : 'Central & West Africa (CEMAC / ECOWAS)',
            delay: isFr ? '3 à 5 jours ouvrés' : isDe ? '3 bis 5 Werktage' : '3 to 5 business days',
            carrier: isFr ? 'DHL Express / Fret Aérien Sécurisé' : isDe ? 'DHL Express / Luftfracht' : 'DHL Express / Air Freight',
            rate: isFr ? 'À partir de 15 000 FCFA (~$25)' : isDe ? 'Ab 15.000 XAF (~$25)' : 'From 15,000 XAF (~$25)',
            detail: isFr ? 'Côte d\'Ivoire, Sénégal, Gabon, Congo, Bénin, Togo, etc.' : isDe ? 'Elfenbeinküste, Senegal, Gabun, Kongo, Benin, Togo usw.' : 'Ivory Coast, Senegal, Gabon, Congo, Benin, Togo, etc.',
        },
        {
            zone: isFr ? 'International (Europe, Amériques, Reste du Monde)' : isDe ? 'International (Europa, Amerika, Rest der Welt)' : 'International (Europe, Americas, Rest of World)',
            delay: isFr ? '4 à 7 jours ouvrés' : isDe ? '4 bis 7 Werktage' : '4 to 7 business days',
            carrier: 'DHL Express Worldwide',
            rate: isFr ? 'Calculé selon destination (~$35 - $45)' : isDe ? 'An der Kasse berechnet (~$35 - $45)' : 'Calculated at checkout (~$35 - $45)',
            detail: isFr ? 'Numéro de suivi en direct et dédouanement prioritaire inclus.' : isDe ? 'Live-Sendungsverfolgung und vorrangige Zollabfertigung inklusive.' : 'Live tracking number and priority customs clearance included.',
        },
    ];

    return (
        <div className="bg-[#FAF8F5] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#FAF8F5] transition-colors pt-28 pb-20">
            {/* Header Banner */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {isFr ? 'POLITIQUE DE LIVRAISON' : isDe ? 'VERSANDRICHTLINIEN' : 'SHIPPING POLICY'}
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            {isFr ? 'Livraison & Expédition' : isDe ? 'Versand & Lieferung' : 'Shipping & Delivery'}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg text-[#3A2418]/80 dark:text-[#FAF8F5]/75 font-sans leading-relaxed">
                            {isFr
                                ? 'Chaque création VAKÁA est préparée avec soin et expédiée sous emballage scellé avec suivi en direct.'
                                : isDe
                                ? 'Jede VAKÁA Kreation wird mit Sorgfalt vorbereitet und versiegelt mit Live-Sendungsverfolgung versandt.'
                                : 'Each VAKÁA creation is carefully prepared and dispatched in sealed packaging with live tracking.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <div className="vakaa-container py-16 space-y-16">
                {/* 3 Trust Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div className="p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-2xs space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Colis Assurés & Scellés' : isDe ? 'Versicherte & Versiegelte Pakete' : 'Insured & Sealed Parcels'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#FAF8F5]/70 leading-relaxed">
                            {isFr
                                ? 'Chaque envoi est entièrement assuré jusqu\'à sa remise en mains propres contre signature.'
                                : isDe
                                ? 'Jede Sendung ist bis zur persönlichen Übergabe gegen Unterschrift voll versichert.'
                                : 'Every shipment is fully insured until safely handed over with signature confirmation.'}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-2xs space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Suivi en Temps Réel' : isDe ? 'Echtzeit-Tracking' : 'Real-Time Tracking'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#FAF8F5]/70 leading-relaxed">
                            {isFr
                                ? 'Dès que votre sac quitte nos ateliers, vous recevez un SMS et un e-mail avec votre numéro de suivi direct.'
                                : isDe
                                ? 'Sobald Ihre Tasche unser Atelier verlässt, erhalten Sie eine Benachrichtigung mit direkter Sendungsverfolgung.'
                                : 'As soon as your creation leaves our atelier, you receive an email and SMS with direct tracking details.'}
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-2xs space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#D4A43C]/10 text-[#D4A43C] flex items-center justify-center">
                            <PackageCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-sans font-bold text-lg">{isFr ? 'Écrin & Pochon VAKÁA' : isDe ? 'Luxusverpackung' : 'Luxury Packaging'}</h3>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#FAF8F5]/70 leading-relaxed">
                            {isFr
                                ? 'Livré dans un dustbag en coton biologique protecteur avec certificat d\'authenticité artisanal.'
                                : isDe
                                ? 'Geliefert in einem Staubbeutel aus Bio-Baumwolle mit Echtheitszertifikat.'
                                : 'Delivered in an organic cotton protective dustbag with an artisanal certificate of authenticity.'}
                        </p>
                    </div>
                </div>

                {/* Shipping Zones Table */}
                <div className="bg-white dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] rounded-2xl sm:rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xs">
                    <div className="space-y-2">
                        <h2 className="font-sans text-2xl font-bold uppercase tracking-wide">
                            {isFr ? 'Grille des Délais & Tarifs par Destination' : isDe ? 'Lieferzeiten & Tarife nach Region' : 'Delivery Times & Rates by Destination'}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#FAF8F5]/70">
                            {isFr
                                ? 'Les délais s\'appliquent à compter de la confirmation et préparation de la commande en atelier.'
                                : isDe
                                ? 'Die Lieferzeiten beginnen ab Bestätigung und Vorbereitung der Bestellung im Atelier.'
                                : 'Delivery time estimates begin once your order has been prepared and inspected.'}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-[#E7DED0] dark:border-[#3A291C] text-[#D4A43C] uppercase text-[11px] tracking-wider font-semibold">
                                    <th className="py-4 pr-4">{isFr ? 'Zone de Livraison' : isDe ? 'Lieferzone' : 'Destination'}</th>
                                    <th className="py-4 px-4">{isFr ? 'Délai Moyen' : isDe ? 'Durchschnittliche Dauer' : 'Estimated Time'}</th>
                                    <th className="py-4 px-4">{isFr ? 'Transporteur' : isDe ? 'Versanddienst' : 'Carrier'}</th>
                                    <th className="py-4 pl-4">{isFr ? 'Tarif Estimatif' : isDe ? 'Geschätzter Tarif' : 'Estimated Rate'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E7DED0]/60 dark:divide-[#3A291C]/60">
                                {shippingZones.map((z, idx) => (
                                    <tr key={idx} className="hover:bg-[#FAF8F5]/60 dark:hover:bg-[#140C06]/40 transition-colors">
                                        <td className="py-4 pr-4 font-semibold text-[#1D120A] dark:text-[#FAF8F5]">
                                            <div>{z.zone}</div>
                                            <div className="text-[11px] text-[#A66B2D] dark:text-[#D4A43C] font-normal mt-0.5">{z.detail}</div>
                                        </td>
                                        <td className="py-4 px-4">{z.delay}</td>
                                        <td className="py-4 px-4 text-[#3A2418]/80 dark:text-[#FAF8F5]/80">{z.carrier}</td>
                                        <td className="py-4 pl-4 font-bold text-[#1D120A] dark:text-[#FAF8F5] whitespace-nowrap">{z.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Need Help Box */}
                <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-sans font-bold text-base text-[#1D120A] dark:text-[#FAF8F5] uppercase tracking-wide">
                            {isFr ? 'Une question sur votre expédition ?' : isDe ? 'Haben Sie Fragen zu Ihrer Sendung?' : 'Questions about your shipment?'}
                        </h4>
                        <p className="text-xs text-[#3A2418]/70 dark:text-[#FAF8F5]/70">
                            {isFr
                                ? 'Notre équipe vous renseigne directement sur les modalités de livraison.'
                                : isDe
                                ? 'Unser Team steht Ihnen bei Fragen zur Lieferung und Sendungsverfolgung zur Verfügung.'
                                : 'Our team is available to assist with delivery arrangements and tracking.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/track-order"
                            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-full border border-[#E7DED0] dark:border-[#3A291C] hover:border-[#1D120A] dark:hover:border-[#FAF8F5] text-[#1D120A] dark:text-[#FAF8F5] transition-colors whitespace-nowrap cursor-pointer"
                        >
                            {isFr ? 'Suivre mon colis' : isDe ? 'Paket verfolgen' : 'Track Order'}
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 py-3 text-xs font-bold uppercase tracking-wider bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                        >
                            {isFr ? 'Nous Écrire' : isDe ? 'Kontaktieren' : 'Contact Us'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
