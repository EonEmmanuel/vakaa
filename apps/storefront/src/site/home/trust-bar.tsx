'use client';

import { motion } from 'framer-motion';
import { Gem, Palette, Shield, Globe } from 'lucide-react';

export function TrustBar() {
    const pillars = [
        {
            icon: Shield,
            title: "Livraison Express Sécurisée",
            description: "Coursier 24-48h & DHL Express Monde",
        },
        {
            icon: Gem,
            title: "Haute Maroquinerie d'Art",
            description: "Cuir tanné végétal et raphia sauvage",
        },
        {
            icon: Globe,
            title: "Retours Gracieux 14 Jours",
            description: "Échanges et retours garantis",
        },
        {
            icon: Palette,
            title: "Conciergerie Dédiée 7j/7",
            description: "Assistance sur mesure",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const } 
        }
    };

    return (
        <section className="py-12 sm:py-16 bg-[#FAF8F5] border-y border-[#E7DED0]">
            <div className="vakaa-container">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0"
                >
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`flex flex-col items-center text-center px-4 ${
                                    idx !== pillars.length - 1 ? 'lg:border-r lg:border-[#E7DED0]' : ''
                                }`}
                            >
                                <div className="size-12 rounded-lg bg-[#F3EFE9] flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-[#A66B2D]" />
                                </div>
                                <h3 className="font-sans text-sm font-bold text-[#1D120A] tracking-tight mb-2">
                                    {pillar.title}
                                </h3>
                                <p className="text-xs text-[#3A2418]/70 leading-relaxed max-w-[200px]">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
