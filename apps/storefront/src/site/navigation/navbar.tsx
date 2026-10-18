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
    return (
        <header className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4 pointer-events-none">
            <FloatingIslandBar>
                {/* Left: Mobile trigger (mobile) | Desktop Nav Links (desktop) */}
                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                    <div className="lg:hidden">
                        <Suspense fallback={<div className="size-10 rounded-full animate-pulse bg-black/5" />}>
                            <MobileNavWrapper />
                        </Suspense>
                    </div>

                    <div className="hidden lg:flex items-center">
                        <Suspense fallback={<div className="h-8 w-80 animate-pulse bg-black/5 rounded-full" />}>
                            <DesktopNav />
                        </Suspense>
                    </div>
                </div>

                {/* Center: Brand Logo centered as requested */}
                <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center justify-center">
                    <NavigationLink href="/" className="inline-block py-1 hover:opacity-90 transition-opacity select-none">
                        <VakaaLogo height={26} />
                    </NavigationLink>
                </div>

                {/* Right: Currency + Language + Search + Account + Cart */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    {/* Currency Picker (desktop) */}
                    <div className="hidden lg:flex items-center">
                        <Suspense fallback={<div className="w-14 h-8 animate-pulse bg-black/5 rounded-full" />}>
                            <CurrencyPickerWrapper />
                        </Suspense>
                    </div>

                    {/* Language Picker (tablet + desktop) */}
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

                    {/* User Account */}
                    <div className="hidden sm:flex items-center">
                        <Suspense fallback={<NavbarUserSkeleton />}>
                            <NavbarUser />
                        </Suspense>
                    </div>

                    {/* Cart Bag Pill */}
                    <Suspense fallback={<div className="h-11 w-24 rounded-full bg-[#1D120A]/20 animate-pulse" />}>
                        <NavbarCart />
                    </Suspense>
                </div>
            </FloatingIslandBar>
        </header>
    );
}
