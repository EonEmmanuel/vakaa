import {getRouteLocale} from '@/platform/i18n/server';
import {cacheLife, cacheTag} from 'next/cache';
import {NavigationLink} from '@/site/navigation/navigation-link';
import {VakaaLogo} from '@/site/navigation/vakaa-logo';

const COPYRIGHT_YEAR = 2026;

function InstagramIcon({className = ""}: {className?: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({className = ""}: {className?: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function TikTokIcon({className = ""}: {className?: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
    );
}

function PinterestIcon({className = ""}: {className?: string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" x2="12" y1="8" y2="16" />
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12 4 4 4-4" />
        </svg>
    );
}

function AfricanGeometricEmblem({className = ""}: {className?: string}) {
    return (
        <svg
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-[#D4A43C] opacity-85 hover:opacity-100 transition-opacity ${className}`}
        >
            {/* Center diamond core */}
            <rect x="70" y="70" width="20" height="20" transform="rotate(45 80 80)" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="80" cy="80" r="3.5" fill="currentColor" />

            {/* Top Branch */}
            <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="80" y1="66" x2="80" y2="18" />
                <line x1="72" y1="62" x2="72" y2="24" />
                <line x1="88" y1="62" x2="88" y2="24" />
                <path d="M68 24C68 20.6863 70.6863 18 74 18H86C89.3137 18 92 20.6863 92 24" />
                <circle cx="80" cy="14" r="3" fill="currentColor" />
                <circle cx="72" cy="20" r="2.5" fill="currentColor" />
                <circle cx="88" cy="20" r="2.5" fill="currentColor" />
            </g>

            {/* Bottom Branch */}
            <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="80" y1="94" x2="80" y2="142" />
                <line x1="72" y1="98" x2="72" y2="136" />
                <line x1="88" y1="98" x2="88" y2="136" />
                <path d="M68 136C68 139.314 70.6863 142 74 142H86C89.3137 142 92 139.314 92 136" />
                <circle cx="80" cy="146" r="3" fill="currentColor" />
                <circle cx="72" cy="140" r="2.5" fill="currentColor" />
                <circle cx="88" cy="140" r="2.5" fill="currentColor" />
            </g>

            {/* Left Branch */}
            <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="66" y1="80" x2="18" y2="80" />
                <line x1="62" y1="72" x2="24" y2="72" />
                <line x1="62" y1="88" x2="24" y2="88" />
                <path d="M24 68C20.6863 68 18 70.6863 18 74V86C18 89.3137 20.6863 92 24 92" />
                <circle cx="14" cy="80" r="3" fill="currentColor" />
                <circle cx="20" cy="72" r="2.5" fill="currentColor" />
                <circle cx="20" cy="88" r="2.5" fill="currentColor" />
            </g>

            {/* Right Branch */}
            <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="94" y1="80" x2="142" y2="80" />
                <line x1="98" y1="72" x2="136" y2="72" />
                <line x1="98" y1="88" x2="136" y2="88" />
                <path d="M136 68C139.314 68 142 70.6863 142 74V86C142 89.3137 139.314 92 136 92" />
                <circle cx="146" cy="80" r="3" fill="currentColor" />
                <circle cx="140" cy="72" r="2.5" fill="currentColor" />
                <circle cx="140" cy="88" r="2.5" fill="currentColor" />
            </g>

            {/* Diagonal interconnecting weave arcs */}
            <path d="M60 60L52 52M100 60L108 52M60 100L52 108M100 100L108 108" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export async function Footer() {
    'use cache'
    cacheLife('days');

    const locale = await getRouteLocale();
    cacheTag(`footer-${locale}`);

    return (
        <footer className="bg-[#140C06] text-[#F8F4EE] border-t border-[#3A291C] mt-auto transition-colors">
            <div className="vakaa-container py-10 sm:py-12 lg:py-14">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-8 items-start">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-3 space-y-4">
                        <div className="flex flex-col items-start">
                            <NavigationLink href="/" className="inline-block">
                                <VakaaLogo variant="light" height={32} />
                            </NavigationLink>
                            <p className="text-xs text-[#B5A496] font-medium tracking-wide mt-3">
                                Carrying Africa. Everywhere.
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2 text-[#D4A43C]">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-8 h-8 rounded-full bg-[#20150D] border border-[#3A291C] flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#140C06] transition-colors"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-8 h-8 rounded-full bg-[#20150D] border border-[#3A291C] flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#140C06] transition-colors"
                            >
                                <FacebookIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-8 h-8 rounded-full bg-[#20150D] border border-[#3A291C] flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#140C06] transition-colors"
                            >
                                <TikTokIcon className="w-4 h-4" />
                            </a>
                            <a
                                href="https://pinterest.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Pinterest"
                                className="w-8 h-8 rounded-full bg-[#20150D] border border-[#3A291C] flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#140C06] transition-colors"
                            >
                                <PinterestIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: SHOP */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
                        <p className="text-xs font-bold tracking-[0.2em] text-[#D4A43C] uppercase">SHOP</p>
                        <ul className="space-y-2 text-xs text-[#B5A496]">
                            <li>
                                <NavigationLink href="/search" className="hover:text-[#F8F4EE] transition-colors">
                                    All Bags
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?category=tote-bags" className="hover:text-[#F8F4EE] transition-colors">
                                    Tote Bags
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?category=shoulder-bags" className="hover:text-[#F8F4EE] transition-colors">
                                    Shoulder Bags
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?category=clutches" className="hover:text-[#F8F4EE] transition-colors">
                                    Clutches
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?category=crossbodies" className="hover:text-[#F8F4EE] transition-colors">
                                    Crossbodies
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?category=accessories" className="hover:text-[#F8F4EE] transition-colors">
                                    Accessories
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: ABOUT */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
                        <p className="text-xs font-bold tracking-[0.2em] text-[#D4A43C] uppercase">ABOUT</p>
                        <ul className="space-y-2 text-xs text-[#B5A496]">
                            <li>
                                <NavigationLink href="/our-story" className="hover:text-[#F8F4EE] transition-colors">
                                    Our Story
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/artisans" className="hover:text-[#F8F4EE] transition-colors">
                                    Artisans
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/search?collection=sustainability" className="hover:text-[#F8F4EE] transition-colors">
                                    Sustainability
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/journal" className="hover:text-[#F8F4EE] transition-colors">
                                    Journal
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/contact" className="hover:text-[#F8F4EE] transition-colors">
                                    FAQs
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: HELP */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
                        <p className="text-xs font-bold tracking-[0.2em] text-[#D4A43C] uppercase">HELP</p>
                        <ul className="space-y-2 text-xs text-[#B5A496]">
                            <li>
                                <NavigationLink href="/shipping-and-delivery" className="hover:text-[#F8F4EE] transition-colors">
                                    Shipping & Delivery
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/returns-and-refunds" className="hover:text-[#F8F4EE] transition-colors">
                                    Returns & Exchanges
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/contact" className="hover:text-[#F8F4EE] transition-colors">
                                    Payment Methods
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/track-order" className="hover:text-[#F8F4EE] transition-colors">
                                    Track Order
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink href="/contact" className="hover:text-[#F8F4EE] transition-colors">
                                    Contact Us
                                </NavigationLink>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: LEGAL & Emblem */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col justify-between items-start lg:items-end gap-6">
                        <div className="space-y-3">
                            <p className="text-xs font-bold tracking-[0.2em] text-[#D4A43C] uppercase">LEGAL</p>
                            <ul className="space-y-2 text-xs text-[#B5A496]">
                                <li>
                                    <NavigationLink href="/terms" className="hover:text-[#F8F4EE] transition-colors">
                                        Terms & Conditions
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink href="/privacy" className="hover:text-[#F8F4EE] transition-colors">
                                        Privacy Policy
                                    </NavigationLink>
                                </li>
                            </ul>
                        </div>

                        {/* African Geometric Artisan Motif */}
                        <div className="pt-2">
                            <AfricanGeometricEmblem className="w-20 h-20 md:w-24 md:h-24" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 sm:mt-10 sm:pt-6 border-t border-[#2A1D14] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#8C7A6D]">
                    <div>
                        &copy; {COPYRIGHT_YEAR} VAKAA. All Rights Reserved. Carrying Africa. Everywhere.
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Worldwide Express Shipping</span>
                        <span className="text-[#3A291C]">|</span>
                        <span>100% Artisan Handcrafted</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
