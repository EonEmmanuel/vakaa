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
            <div className="bg-[#F8F4EE]/60 dark:bg-[#140C06]/60 backdrop-blur-md border-b border-[#E7DED0]/40 dark:border-[#3A291C]/40">
                <div className="vakaa-container">
                    <div className="flex items-center justify-between h-14 sm:h-18">
                        {/* Left: Desktop Nav Links / Mobile Menu Trigger */}
                        <div className="flex items-center gap-4 lg:gap-6">
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
                                <VakaaLogo />
                            </NavigationLink>
                        </div>

                        {/* Right: Currency + Language + Search + Account + Cart */}
                        <div className="flex items-center gap-0.5 sm:gap-2">
                            <CurrencyPicker
                                availableCurrencyCodes={['XAF', 'EUR', 'USD']}
                                activeCurrencyCode="XAF"
                            />
                            <Suspense fallback={<div className="w-8 h-8" />}>
                                <LanguagePicker />
                            </Suspense>
                            <Suspense fallback={<div className="w-8 sm:w-9 h-8 sm:h-9" />}>
                                <NavbarSearch />
                            </Suspense>
                            <Suspense fallback={<NavbarUserSkeleton />}>
                                <NavbarUser />
                            </Suspense>
                            <Suspense fallback={<div className="w-8 sm:w-9 h-8 sm:h-9" />}>
                                <NavbarCart />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
