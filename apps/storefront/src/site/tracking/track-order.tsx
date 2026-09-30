'use client';

import { useState } from 'react';
import { useRouter } from '@/platform/i18n/navigation';
import { Package, Search, Truck, Clock, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TrackOrderPage() {
    const router = useRouter();
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const code = orderCode.trim();

        if (!code) {
            setError('Veuillez saisir votre numéro de commande (ex: 6X8X8GJAU3ABKV53).');
            return;
        }

        setIsSearching(true);
        // Redirect directly to the full order confirmation & tracking view
        router.push(`/order-confirmation/${encodeURIComponent(code)}`);
    };

    const timelineSteps = [
        {
            num: '01',
            title: 'Paiement Confirmé',
            titleEn: 'Payment Confirmed',
            desc: 'Votre commande est validée et inscrite au registre de préparation de nos ateliers.',
        },
        {
            num: '02',
            title: 'Contrôle Qualité Atelier',
            titleEn: 'Atelier Inspection',
            desc: 'Nos artisans inspectent méticuleusement le cuir, les coutures et la dorure des pièces.',
        },
        {
            num: '03',
            title: 'Écrin & Mise sous Scellé',
            titleEn: 'Sealed & Packaged',
            desc: 'Votre pièce est déposée dans son dustbag protecteur et son coffret rigide VAKÁA.',
        },
        {
            num: '04',
            title: 'En Cours d\'Acheminement',
            titleEn: 'In Transit',
            desc: 'Le colis est confié à notre coursier privé ou à DHL Express avec numéro de suivi en direct.',
        },
        {
            num: '05',
            title: 'Livraison en Mains Propres',
            titleEn: 'Delivered in Person',
            desc: 'Remise sécurisée à votre porte contre signature.',
        },
    ];

    return (
        <div className="bg-[#F8F4EE] dark:bg-[#140C06] min-h-screen text-[#1D120A] dark:text-[#F8F4EE] transition-colors pt-28 pb-20">
            {/* Header */}
            <section className="relative overflow-hidden py-16 sm:py-20 border-b border-[#E7DED0]/60 dark:border-[#3A291C]">
                <div className="vakaa-container">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#D4A43C] uppercase">
                            SUIVI DE COMMANDE
                        </span>
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
                            Suivre Ma Commande
                        </h1>
                        <div className="w-16 h-[2px] bg-[#D4A43C] mx-auto rounded-full" />
                        <p className="text-base sm:text-lg text-[#3A2418]/80 dark:text-[#F8F4EE]/75 font-sans leading-relaxed">
                            Renseignez votre référence de commande pour consulter l'acheminement de votre colis en direct.
                        </p>
                    </div>
                </div>
            </section>

            <div className="vakaa-container py-16 max-w-4xl mx-auto space-y-16">
                {/* Search Card */}
                <div className="p-8 sm:p-10 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] shadow-sm space-y-6">
                    <div className="flex items-center gap-3 text-[#D4A43C]">
                        <Package className="w-6 h-6" />
                        <h2 className="font-sans text-xl font-bold uppercase tracking-wide text-[#1D120A] dark:text-[#F8F4EE]">
                            Rechercher une Expédition
                        </h2>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="orderCode" className="text-xs uppercase font-semibold tracking-wider text-[#3A2418]/80 dark:text-[#F8F4EE]/80">
                                    Numéro de Commande *
                                </Label>
                                <Input
                                    id="orderCode"
                                    placeholder="Ex: 6X8X8GJAU3ABKV53"
                                    value={orderCode}
                                    onChange={(e) => setOrderCode(e.target.value)}
                                    className="h-12 bg-[#F8F4EE]/50 dark:bg-[#140C06] border-[#E7DED0] dark:border-[#3A291C] uppercase font-mono tracking-wider text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase font-semibold tracking-wider text-[#3A2418]/80 dark:text-[#F8F4EE]/80">
                                    E-mail Utilisé Lors de la Commande
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-[#F8F4EE]/50 dark:bg-[#140C06] border-[#E7DED0] dark:border-[#3A291C] text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xs">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSearching}
                            className="w-full h-13 text-xs font-bold uppercase tracking-[0.2em] bg-[#1D120A] hover:bg-[#3A2418] text-[#F8F4EE] dark:bg-[#D4A43C] dark:hover:bg-[#BF9232] dark:text-[#140C06] rounded-xs transition-colors shadow-sm"
                        >
                            {isSearching ? (
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 animate-spin" />
                                    Recherche en cours...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Consulter le Statut de Livraison
                                </span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Progress Steps Explanation */}
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-[11px] font-bold tracking-[0.2em] text-[#D4A43C] uppercase">
                            ACHEMINEMENT
                        </span>
                        <h3 className="font-sans text-2xl font-bold uppercase tracking-wide">
                            Étapes de Préparation et Livraison
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {timelineSteps.map((step, idx) => (
                            <div key={idx} className="p-5 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] space-y-3">
                                <div className="text-2xl font-sans font-bold text-[#D4A43C]">
                                    {step.num}
                                </div>
                                <h4 className="font-sans font-bold text-sm text-[#1D120A] dark:text-[#F8F4EE]">
                                    {step.title}
                                </h4>
                                <p className="text-[11px] text-[#3A2418]/70 dark:text-[#F8F4EE]/70 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Direct Assistance Bar */}
                <div className="p-6 sm:p-8 rounded-sm bg-[#FFFFFF] dark:bg-[#1D120A] border border-[#E7DED0]/80 dark:border-[#3A291C] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                        <h4 className="font-sans font-bold text-base text-[#1D120A] dark:text-[#F8F4EE] uppercase tracking-wide">
                            Une question sur votre livraison ?
                        </h4>
                        <p className="text-xs text-[#3A2418]/70 dark:text-[#F8F4EE]/70">
                            Notre équipe vous renseigne directement sur l'acheminement de votre colis.
                        </p>
                    </div>
                    <a
                        href="https://wa.me/237677077594?text=Bonjour%20Maison%20VAKAA,%20je%20souhaite%20suivre%20ma%20commande."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#E7DED0] dark:border-[#3A291C] hover:border-[#25D366] text-[#3A2418] dark:text-[#F8F4EE] hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <MessageCircle className="w-4 h-4 text-[#25D366]" />
                        <span>Support WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
