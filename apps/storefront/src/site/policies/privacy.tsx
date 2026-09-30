import { getRouteLocale } from '@/platform/i18n/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    return {
        title: isFr ? 'Politique de Confidentialité | Maison VAKÁA' : 'Privacy Policy | Maison VAKÁA',
        description: isFr
            ? 'Engagements de protection de la vie privée et de sécurité des données personnelles de Maison VAKÁA.'
            : 'Privacy and data protection commitments by Maison VAKÁA.',
    };
}

export async function PrivacyPage() {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Header Banner */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {isFr ? 'PROTECTION DES DONNÉES & VIE PRIVÉE' : 'DATA SECURITY & PRIVACY'}
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70 font-sans">
                            {isFr ? 'Maison VAKÁA — Respect absolu de vos données personnelles' : 'Maison VAKÁA — Complete discretion & data integrity'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Articles */}
            <div className="vakaa-container py-16 max-w-4xl mx-auto space-y-12 text-xs sm:text-sm text-[#3A2418]/85 dark:text-[#F8F4EE]/85 leading-relaxed font-sans">
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '1. Collecte des Informations' : '1. Information We Collect'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Nous collectons uniquement les informations indispensables au traitement et à l\'acheminement de vos commandes : nom complet, adresse de livraison, numéro de téléphone (pour contact avec le coursier) et adresse e-mail pour l\'envoi de la facture et du suivi.'
                            : 'We collect only the essential information necessary to fulfill and deliver your orders: full name, shipping destination, phone number for courier coordination, and email address for receipt and tracking.'}
                    </p>
                </div>

                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '2. Sécurité Bancaire & Cartes' : '2. Payment Card Security'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Maison VAKÁA ne stocke ni ne manipule aucune coordonnée bancaire ni code PIN. Toutes les opérations de paiement sont directement opérées dans des environnements bancaires ultra-sécurisés certifiés PCI-DSS (SebPay, Flutterwave).'
                            : 'Maison VAKÁA never stores or sees your payment card numbers or mobile money PINs. All payment transactions occur directly within certified PCI-DSS compliant secure environments (SebPay, Flutterwave).'}
                    </p>
                </div>

                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '3. Vos Droits d\'Accès & Rectification' : '3. Your Rights & Data Access'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Conformément aux réglementations sur la protection des données, vous disposez d\'un droit total d\'accès, de modification ou de suppression de vos données personnelles sur simple demande par e-mail à contact@vakaa.store.'
                            : 'Under data protection standards, you maintain full rights to inspect, update, or permanently delete your customer records by contacting contact@vakaa.store.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
