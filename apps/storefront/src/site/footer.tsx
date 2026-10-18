import {getRouteLocale} from '@/platform/i18n/server';
import {cacheLife, cacheTag} from 'next/cache';
import {NavigationLink} from '@/site/navigation/navigation-link';
import {VakaaLogo} from '@/site/navigation/vakaa-logo';
import {ArrowUpRight} from 'lucide-react';

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

export async function Footer() {
    'use cache';
    cacheLife('days');

    const locale = await getRouteLocale();
    cacheTag(`footer-${locale}`);

    const isFr = (locale || 'fr').startsWith('fr');

    return (
        <footer className="px-3 pb-3 sm:px-5 sm:pb-5 bg-[#f2efe9] dark:bg-[#151413] mt-auto">
            <div className="relative overflow-hidden rounded-[28px] bg-[#1c1b18] px-5 pt-9 text-[#fbfaf7] sm:rounded-[32px] sm:px-12 sm:pt-14 shadow-tile border border-black/5 dark:border-white/10">
                {/* ═══ Top Section: Brand Statement & Columns ═══ */}
                <div className="grid gap-9 md:grid-cols-[1.4fr_2fr] md:gap-12">
                    {/* Left: Brand Vision & Statement */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 sm:mb-5">
                            <NavigationLink href="/" className="inline-block focus:outline-hidden">
                                <VakaaLogo variant="light" height={30} />
                            </NavigationLink>
                        </div>

                        <p className="max-w-sm font-display text-[1.6rem] font-semibold leading-[1.1] tracking-tight sm:text-3xl text-[#fbfaf7]">
                            {isFr ? "Porter l'Afrique. Partout." : "Carrying Africa. Everywhere."}
                        </p>

                        <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#fbfaf7]/70 sm:mt-4 sm:text-[15px] font-sans">
                            {isFr
                                ? "Maroquinerie d'artisanat sculptée à la main en paille de Bolgatanga et cuir pleine fleur. Façonnée pour l'éternité."
                                : "Fine leather goods hand-sculpted from Bolgatanga elephant grass and full-grain leather. Crafted for eternity."}
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex items-center gap-2.5 text-[#fbfaf7]/75">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="size-8.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#1c1b18] hover:border-[#D4A43C] transition-all duration-200 cursor-pointer"
                            >
                                <InstagramIcon className="size-4" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="size-8.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#1c1b18] hover:border-[#D4A43C] transition-all duration-200 cursor-pointer"
                            >
                                <FacebookIcon className="size-4" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="size-8.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#1c1b18] hover:border-[#D4A43C] transition-all duration-200 cursor-pointer"
                            >
                                <TikTokIcon className="size-4" />
                            </a>
                            <a
                                href="https://pinterest.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Pinterest"
                                className="size-8.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#D4A43C] hover:text-[#1c1b18] hover:border-[#D4A43C] transition-all duration-200 cursor-pointer"
                            >
                                <PinterestIcon className="size-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right: 3 Nav Columns */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
                        {/* Column 1: Boutique / Shop */}
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#fbfaf7]/60 font-medium">
                                {isFr ? 'Boutique' : 'Shop'}
                            </p>
                            <ul className="mt-2.5 space-y-0.5">
                                <li>
                                    <NavigationLink
                                        href="/search"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Tous les sacs' : 'All bags'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/collection/tote-bags"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Sacs Cabas & Totes' : 'Totes & Baskets'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/collection/shoulder-bags"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Sacs Épaule' : 'Shoulder Bags'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/collection/clutches"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Pochettes & Soirée' : 'Clutches & Evening'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/collection/accessories"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Petite Maroquinerie' : 'Small Leather Goods'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: La Maison / About */}
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#fbfaf7]/60 font-medium">
                                {isFr ? 'La Maison' : 'The House'}
                            </p>
                            <ul className="mt-2.5 space-y-0.5">
                                <li>
                                    <NavigationLink
                                        href="/our-story"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Notre Histoire' : 'Our Story'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/artisans"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Les Artisans' : 'The Artisans'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/journal"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Le Journal' : 'Journal'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/contact"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Contact & FAQ' : 'Contact & FAQ'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Compte & Service */}
                        <div className="col-span-2 sm:col-span-1">
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#fbfaf7]/60 font-medium">
                                {isFr ? 'Compte & Service' : 'Account & Care'}
                            </p>
                            <ul className="mt-2.5 space-y-0.5">
                                <li>
                                    <NavigationLink
                                        href="/sign-in"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Se connecter' : 'Sign in'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/track-order"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Suivi de commande' : 'Track order'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/shipping-and-delivery"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Livraison sous 48h' : '48h Shipping'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                                <li>
                                    <NavigationLink
                                        href="/returns-and-refunds"
                                        className="group inline-flex min-h-8 sm:min-h-9 items-center gap-1 text-[14px] sm:text-[15px] text-[#fbfaf7]/85 transition-colors hover:text-[#fbfaf7]"
                                    >
                                        <span>{isFr ? 'Retours offerts 30j' : 'Free 30-day returns'}</span>
                                        <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-[#D4A43C]" />
                                    </NavigationLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ═══ Monumental Brand Typographic Statement (Exact KVIST Letter Spacing) ═══ */}
                <div
                    aria-hidden="true"
                    className="mt-8 sm:mt-16 flex justify-between font-display text-[clamp(3.2rem,21vw,21rem)] font-bold leading-[0.76] tracking-[-0.055em] text-[#fbfaf7] select-none pointer-events-none"
                >
                    <span className="inline-block overflow-hidden"><span className="inline-block">V</span></span>
                    <span className="inline-block overflow-hidden"><span className="inline-block">A</span></span>
                    <span className="inline-block overflow-hidden"><span className="inline-block">K</span></span>
                    <span className="inline-block overflow-hidden"><span className="inline-block">Á</span></span>
                    <span className="inline-block overflow-hidden"><span className="inline-block">A</span></span>
                </div>

                {/* ═══ Bottom Bar: Copyright & Legal (Clearance for floating actions) ═══ */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#fbfaf7]/15 pt-4 pb-16 text-[12px] text-[#fbfaf7]/60 sm:py-5 sm:text-[13px] font-sans">
                    <span>© {COPYRIGHT_YEAR} VAKÁA Paris · Maison de Haute Maroquinerie</span>
                    <div className="flex items-center gap-4">
                        <NavigationLink href="/terms" className="hover:text-[#fbfaf7] transition-colors">
                            {isFr ? 'Conditions' : 'Terms'}
                        </NavigationLink>
                        <span>·</span>
                        <NavigationLink href="/privacy" className="hover:text-[#fbfaf7] transition-colors">
                            {isFr ? 'Confidentialité' : 'Privacy'}
                        </NavigationLink>
                        <span>·</span>
                        <span className="text-[#D4A43C]/90">Bolgatanga · Paris</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}