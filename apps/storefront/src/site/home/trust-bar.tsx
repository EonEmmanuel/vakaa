import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export function TrustBar() {
    const pillars = [
        {
            icon: Truck,
            title: "Livraison Express Sécurisée",
            description: "Coursier 24-48h à Douala & Yaoundé, DHL Express Monde",
        },
        {
            icon: ShieldCheck,
            title: "100% Haute Maroquinerie d'Art",
            description: "Cuir tanné végétal et raphia sauvage façonnés main",
        },
        {
            icon: RotateCcw,
            title: "Retours Gracieux 14 Jours",
            description: "Échanges et retours garantis sous 14 jours ouvrés",
        },
        {
            icon: Headphones,
            title: "Conciergerie Dédiée 7j/7",
            description: "Conseils sur mesure & assistance WhatsApp directe",
        },
    ];

    return (
        <section className="py-6 sm:py-8 bg-[#FAF8F5] border-b border-[#E7DED0]/80 transition-colors">
            <div className="vakaa-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded-2xl group transition-all"
                            >
                                <div className="size-9 sm:size-10 rounded-full bg-white ring-1 ring-[#E7DED0] flex items-center justify-center shrink-0 group-hover:ring-[#D4A43C]/60 group-hover:scale-105 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xs">
                                    <Icon className="w-4 h-4 text-[#A66B2D]" />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                    <h3 className="font-sans text-xs sm:text-[13px] font-bold text-[#1D120A] tracking-tight leading-tight">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-[10px] sm:text-[11px] text-[#3A2418]/65 leading-tight line-clamp-2">
                                        {pillar.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
