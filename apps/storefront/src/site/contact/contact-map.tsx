'use client';

import { MapPin, Navigation } from 'lucide-react';

export function ContactMap() {
    return (
        <section className="relative w-full h-[380px] sm:h-[440px] bg-[#EFECE6] overflow-hidden border-b border-[#E7DED0]">
            {/* Grayscale Map Embed */}
            <iframe
                title="Boutique & Atelier Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1780%2C5.5900%2C-0.1650%2C5.6100&amp;layer=mapnik&amp;marker=5.6020%2C-0.1720"
                className="w-full h-full border-0 filter grayscale contrast-125 brightness-95 opacity-85 hover:opacity-100 transition-opacity"
                loading="lazy"
            />

            {/* Aesthetic Ambient Pointer Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#1D120A]/20 animate-ping absolute inset-0" />
                    <div className="w-12 h-12 rounded-full bg-[#1D120A] text-[#D4A43C] border-2 border-white shadow-xl flex items-center justify-center relative z-10">
                        <MapPin className="w-6 h-6 stroke-[2.25]" />
                    </div>
                </div>
                <div className="mt-2 bg-[#1D120A] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-white/20 whitespace-nowrap flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#D4A43C]" />
                    <span>Maison VAKAA • Flagship Atelier</span>
                </div>
            </div>

            {/* Quick map control link */}
            <div className="absolute bottom-4 right-4 z-10">
                <a
                    href="https://maps.google.com/?q=Accra+Ghana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 backdrop-blur-sm hover:bg-white text-[#1D120A] text-xs font-semibold px-4 py-2 rounded-full border border-[#E7DED0] shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                    <span>Ouvrir dans Maps</span>
                </a>
            </div>
        </section>
    );
}

