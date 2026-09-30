import { getRouteLocale } from '@/platform/i18n/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';
    return {
        title: isFr ? 'Conditions Générales de Vente | Maison VAKÁA' : 'Terms & Conditions of Sale | Maison VAKÁA',
        description: isFr
            ? 'Conditions générales de vente et d\'utilisation de la boutique en ligne Maison VAKÁA.'
            : 'Terms and conditions governing online purchases and services by Maison VAKÁA.',
    };
}

export async function TermsPage() {
    const locale = await getRouteLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Header Banner */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            {isFr ? 'CADRE JURIDIQUE & TRANSPARENCE' : 'LEGAL FRAMEWORK & TERMS'}
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            {isFr ? 'Conditions Générales de Vente' : 'Terms & Conditions'}
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-xs sm:text-sm text-[#3A2418]/70 dark:text-[#F8F4EE]/70 font-sans">
                            {isFr ? 'Dernière mise à jour : Septembre 2026' : 'Last updated: September 2026'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Legal Articles */}
            <div className="vakaa-container py-16 max-w-4xl mx-auto space-y-12 text-xs sm:text-sm text-[#3A2418]/85 dark:text-[#F8F4EE]/85 leading-relaxed font-sans">
                {/* Article 1 */}
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '1. Préambule & Identification de la Maison' : '1. Preamble & Merchant Identity'}
                    </h2>
                    <p>
                        {isFr 
                            ? 'Les présentes Conditions Générales de Vente (CGV) régissent l\'ensemble des commandes passées sur la boutique en ligne officielle de Maison VAKÁA (vakaa.store), maison de haute maroquinerie artisanale enregistrée en République du Cameroun.'
                            : 'These Terms of Sale govern all orders placed on the official online boutique of Maison VAKÁA (vakaa.store), luxury handcrafted leather goods brand registered in Cameroon.'}
                    </p>
                </div>

                {/* Article 2 */}
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '2. Authenticité des Créations & Caractère Artisanal' : '2. Authenticity & Artisanal Craftsmanship'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Chaque création VAKÁA est confectionnée manuellement par nos maîtres artisans à partir de matières nobles (fibres de raphia naturel, cuirs tannés végétalement, boucles en laiton coulé). En raison de ce procédé manuel et des propriétés organiques des fibres, de subtiles variations de grain, de teinte ou de texture constituent le sceau d\'authenticité de chaque pièce unique.'
                            : 'Every VAKÁA piece is handcrafted using noble natural materials (wild raffia, vegetable-tanned cowhide, solid brass). Due to the organic nature of these materials and artisanal hand-weaving, slight nuances in grain and texture represent the hallmark of authentic handcrafted luxury.'}
                    </p>
                </div>

                {/* Article 3 */}
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '3. Prix, Devises & Paiement Sécurisé' : '3. Pricing, Currencies & Secure Payment'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Les prix sont indiqués en Francs CFA (XAF/XOF), Euros (EUR) ou Dollars US (USD) selon votre localisation géographique. Les transactions sont sécurisées par cryptage SSL et traitées via nos partenaires agréés : SebPay (Mobile Money MTN, Orange, Wave, Moov) et Flutterwave (Cartes Visa, Mastercard, M-Pesa, Virement bancaire). Le débit est immédiat lors de la confirmation de commande.'
                            : 'Prices are displayed in CFA Francs (XAF/XOF), Euros (EUR), or US Dollars (USD). Transactions are encrypted via high-grade SSL and processed through licensed partners: SebPay (African Mobile Money) and Flutterwave (Cards, M-Pesa, Bank Transfer). Payment is confirmed upon checkout completion.'}
                    </p>
                </div>

                {/* Article 4 */}
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '4. Expédition, Transfert des Risques & Réception' : '4. Shipping, Risk Transfer & Delivery'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Les pièces sont expédiées sous scellés assurés. Les risques liés au transport sont assumés par Maison VAKÁA jusqu\'à la remise effective en mains propres contre signature au client ou destinataire désigné.'
                            : 'All pieces are dispatched under insured seal. Transport liability remains with Maison VAKÁA until physical delivery and signature confirmation by the recipient.'}
                    </p>
                </div>

                {/* Article 5 */}
                <div className="space-y-3 bg-[#FFFFFF] dark:bg-[#1D120A] p-6 sm:p-8 rounded-sm border border-[#E7DED0]/80 dark:border-[#3A291C]">
                    <h2 className="font-sans text-lg sm:text-xl font-bold text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                        {isFr ? '5. Propriété Intellectuelle & Protection des Modèles' : '5. Intellectual Property & Brand Protection'}
                    </h2>
                    <p>
                        {isFr
                            ? 'Les dessins, modèles, formes de sacs, tressages exclusifs, photographies, logos et marques VAKÁA sont la propriété exclusive de Maison VAKÁA. Toute contrefaçon, reproduction ou imitation non autorisée sera poursuivie.'
                            : 'All patterns, bag designs, bespoke weaves, photographs, logos, and trademarks remain the exclusive intellectual property of Maison VAKÁA. Unauthorized reproduction or imitation is strictly prohibited.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
