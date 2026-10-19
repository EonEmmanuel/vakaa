import { NavigationLink } from '@/site/navigation/navigation-link';
import { VakaaLogo } from '@/site/navigation/vakaa-logo';
import { DesktopNav } from '@/site/navigation/desktop-nav';
import { NavbarCart } from '@/site/navigation/navbar/navbar-cart';
import { NavbarUser } from '@/site/navigation/navbar/navbar-user';
import { NavbarSearch } from '@/site/navigation/navbar/navbar-search';
import { LanguagePicker } from '@/site/navigation/navbar/language-picker';
import { CurrencyPickerWrapper } from '@/site/navigation/navbar/currency-picker-wrapper';
import { MobileNavWrapper } from '@/site/navigation/navbar/mobile-nav-wrapper';
import { Suspense } from 'react';
import { NavbarUserSkeleton } from '@/site/navigation/skeletons/navbar-user-skeleton';
import { FloatingIslandBar } from '@/site/navigation/floating-island-bar';

export function Navbar() {
    // Island row zones:
    // - Below lg: brand side-anchored left, actions right (unchanged).
    // - lg+: brand wordmark exactly centered (absolute overlay);
    //   inline nav links only appear from xl up, where they can never
    //   collide with the centered wordmark in any locale.
    return (
        <header className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4 pointer-events-none">
            <FloatingIslandBar>
                {/* Row: Brand Logo (side-anchored, below lg) */}
                <div className="flex lg:hidden items-center gap-2 sm:gap-4 shrink-0 pointer-events-auto">
                    <NavigationLink href="/" className="inline-block py-1 hover:opacity-90 transition-opacity select-none">
                        <VakaaLogo height={26} />
                    </NavigationLink>
                </div>

                {/* Overlay: Brand Logo (exactly centered, lg and up) */}
                <div className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2 lg:items-center pointer-events-auto">
                    <NavigationLink href="/" className="inline-block py-1 hover:opacity-90 transition-opacity select-none">
                        <VakaaLogo height={26} />
                    </NavigationLink>
                </div>

                {/* Row: Desktop Nav Links (anchored left, xl and up) */}
                <div className="hidden xl:flex items-center min-w-0 px-2 xl:px-4">
                    <Suspense fallback={<div className="h-8 w-80 animate-pulse bg-black/5 rounded-full" />}>
                        <DesktopNav />
                    </Suspense>
                </div>

                {/* Row: Currency + Language + Search + User + Cart + Mobile Menu */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
                    {/* Currency Picker (lg and up) */}
                    <div className="hidden lg:flex items-center">
                        <Suspense fallback={<div className="w-14 h-8 animate-pulse bg-black/5 rounded-full" />}>
                            <CurrencyPickerWrapper />
                        </Suspense>
                    </div>

                    {/* Language Picker (tablet and up) */}
                    <div className="hidden sm:flex items-center">
                        <Suspense fallback={<div className="w-12 h-8 animate-pulse bg-black/5 rounded-full" />}>
                            <LanguagePicker />
                        </Suspense>
                    </div>

                    {/* Search */}
                    <div className="hidden sm:flex items-center">
                        <Suspense fallback={<div className="size-9 rounded-full animate-pulse bg-black/5" />}>
                            <NavbarSearch />
                        </Suspense>
                    </div>

                    {/* User Account (mobile + desktop) */}
                    <div className="flex items-center">
                        <Suspense fallback={<NavbarUserSkeleton />}>
                            <NavbarUser />
                        </Suspense>
                    </div>

                    {/* Cart Bag Pill */}
                    <Suspense fallback={<div className="h-11 sm:h-12 w-16 sm:w-24 rounded-full bg-[#1D120A]/20 animate-pulse" />}>
                        <NavbarCart />
                    </Suspense>

                    {/* Mobile Menu Trigger (below xl, hamburger right) */}
                    <div className="xl:hidden flex items-center">
                        <Suspense fallback={<div className="size-11 rounded-full animate-pulse bg-black/5" />}>
                            <MobileNavWrapper />
                        </Suspense>
                    </div>
                </div>
            </FloatingIslandBar>
        </header>
    );
}
