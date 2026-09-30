import {NavigationLink} from '@/site/navigation/navigation-link';
import {DesktopNav} from '@/site/navigation/desktop-nav';
import {NavbarCart} from '@/site/navigation/navbar/navbar-cart';
import {NavbarUser} from '@/site/navigation/navbar/navbar-user';
import {NavbarSearch} from '@/site/navigation/navbar/navbar-search';
import {MobileNavWrapper} from '@/site/navigation/navbar/mobile-nav-wrapper';
import {Suspense} from "react";
import {NavbarUserSkeleton} from '@/site/navigation/skeletons/navbar-user-skeleton';
import {VakaaLogo} from '@/site/navigation/vakaa-logo';
import {CurrencyPicker} from '@/site/navigation/navbar/currency-picker';
import {LanguagePicker} from '@/site/navigation/navbar/language-picker';

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-colors">
            <div className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7DED0]/60">
                <div className="vakaa-container">
                    <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
                        {/* Left: Mobile Menu Trigger on mobile / Desktop Nav Links on lg */}
                        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
                            <div className="lg:hidden">
                                <Suspense fallback={<div className="w-9 h-9" />}>
                                    <MobileNavWrapper />
                                </Suspense>
                            </div>
                            <Suspense fallback={<div className="hidden lg:flex items-center gap-8 w-80 h-5" />}>
                                <DesktopNav />
                            </Suspense>
                        </div>

                        {/* Center: Brand Logo */}
                        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
                            <NavigationLink href="/" className="inline-block py-1">
                                <VakaaLogo height={26} />
                            </NavigationLink>
                        </div>

                        {/* Right: Currency + Language (md+) | Search + Account (sm+) + Cart */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="hidden md:flex items-center">
                                <CurrencyPicker
                                    availableCurrencyCodes={['XAF', 'EUR', 'USD', 'NGN']}
                                    activeCurrencyCode="XAF"
                                />
                            </div>
                            <div className="hidden md:flex items-center">
                                <Suspense fallback={<div className="w-8 h-8" />}>
                                    <LanguagePicker />
                                </Suspense>
                            </div>
                            <Suspense fallback={<div className="w-9 h-9" />}>
                                <NavbarSearch />
                            </Suspense>
                            <div className="hidden sm:flex items-center">
                                <Suspense fallback={<NavbarUserSkeleton />}>
                                    <NavbarUser />
                                </Suspense>
                            </div>
                            <Suspense fallback={<div className="w-9 h-9" />}>
                                <NavbarCart />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
