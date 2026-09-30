'use client';

import {useState} from 'react';
import { Link, useRouter, usePathname } from '@/platform/i18n/navigation';
import {Menu, Search, ShoppingBag, User, Package, MapPin, Compass, BookOpen, Mail, Home} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from '@/components/ui/sheet';
import {useTranslations} from 'next-intl';
import {LanguagePicker} from './language-picker';
import {CurrencyPicker} from './currency-picker';

interface Collection {
    id: string;
    name: string;
    slug: string;
}

interface MobileNavProps {
    collections: Collection[];
}

export function MobileNav({collections}: MobileNavProps) {
    const t = useTranslations('Navigation');
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        setOpen(false);
    };

    const handleLinkClick = () => {
        setOpen(false);
    };

    const navItems = [
        { label: 'Home', href: '/', icon: Home, isActive: pathname === '/' },
        { label: 'Shop All', href: '/search', icon: ShoppingBag, isActive: pathname === '/search' || pathname.startsWith('/collection/') || pathname.startsWith('/product/') },
        { label: 'Our Story', href: '/our-story', icon: Compass, isActive: pathname === '/our-story' },
        { label: 'Artisans', href: '/artisans', icon: User, isActive: pathname === '/artisans' },
        { label: 'Journal', href: '/journal', icon: BookOpen, isActive: pathname === '/journal' },
        { label: 'Contact', href: '/contact', icon: Mail, isActive: pathname === '/contact' },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
                <Menu className="size-5" />
                <span className="sr-only">{t('openMenu')}</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto bg-[#F8F4EE] dark:bg-[#140C06]">
                <SheetHeader>
                    <SheetTitle className="font-sans font-bold text-[#1D120A] dark:text-[#F8F4EE]">{t('menu')}</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-4 pb-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t('searchProducts')}
                            className="pl-9 w-full bg-white dark:bg-[#1D120A] border-[#E7DED0] dark:border-[#3A291C]"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>

                    {/* Editorial & Navigation Links */}
                    <div>
                        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                            Explore
                        </p>
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.href}
                                        className="animate-fade-up"
                                        style={{ animationDelay: `${idx * 35}ms` }}
                                    >
                                        <SheetClose
                                            render={
                                                <Link
                                                    href={item.href}
                                                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-sm cursor-pointer transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-standard)] motion-reduce:transition-none hover:translate-x-0.5 ${
                                                        item.isActive
                                                            ? 'bg-[#EFE8DD] dark:bg-[#2A1B10] text-[#1D120A] dark:text-[#F8F4EE] font-semibold border-l-2 border-[#D4A43C]'
                                                            : 'text-[#1D120A]/80 dark:text-[#F8F4EE]/80 hover:bg-[#EFE8DD]/50 dark:hover:bg-[#2A1B10]/50 hover:text-[#D4A43C]'
                                                    }`}
                                                />
                                            }
                                            nativeButton={false}
                                            onClick={handleLinkClick}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`h-4 w-4 ${item.isActive ? 'text-[#D4A43C]' : ''}`} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C]" />
                                            )}
                                        </SheetClose>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Collections */}
                    {collections.length > 0 && (
                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                                {t('collections')}
                            </p>
                            <nav className="flex flex-col gap-0.5">
                                {collections.map((collection) => {
                                    const isColActive = pathname === `/collection/${collection.slug}`;
                                    return (
                                        <SheetClose
                                            key={collection.slug}
                                            render={
                                                <Link
                                                    href={`/collection/${collection.slug}`}
                                                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                                                        isColActive
                                                            ? 'bg-[#EFE8DD] dark:bg-[#2A1B10] text-[#1D120A] dark:text-[#F8F4EE] font-semibold'
                                                            : 'text-[#1D120A]/70 dark:text-[#F8F4EE]/70 hover:bg-[#EFE8DD]/40'
                                                    }`}
                                                />
                                            }
                                            nativeButton={false}
                                            onClick={handleLinkClick}
                                        >
                                            <span>{collection.name}</span>
                                            {isColActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C]" />}
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Account links */}
                    <div>
                        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                            {t('account')}
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/profile"
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                                            pathname === '/account/profile'
                                                ? 'bg-[#EFE8DD] dark:bg-[#2A1B10] font-semibold text-[#1D120A] dark:text-[#F8F4EE]'
                                                : 'text-[#1D120A]/70 dark:text-[#F8F4EE]/70 hover:bg-[#EFE8DD]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <User className="h-4 w-4" />
                                {t('profile')}
                            </SheetClose>
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/orders"
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                                            pathname.startsWith('/account/orders')
                                                ? 'bg-[#EFE8DD] dark:bg-[#2A1B10] font-semibold text-[#1D120A] dark:text-[#F8F4EE]'
                                                : 'text-[#1D120A]/70 dark:text-[#F8F4EE]/70 hover:bg-[#EFE8DD]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <Package className="h-4 w-4" />
                                {t('orders')}
                            </SheetClose>
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/addresses"
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                                            pathname === '/account/addresses'
                                                ? 'bg-[#EFE8DD] dark:bg-[#2A1B10] font-semibold text-[#1D120A] dark:text-[#F8F4EE]'
                                                : 'text-[#1D120A]/70 dark:text-[#F8F4EE]/70 hover:bg-[#EFE8DD]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <MapPin className="h-4 w-4" />
                                {t('addresses')}
                            </SheetClose>
                        </nav>
                    </div>

                    {/* Regional Settings */}
                    <div className="pt-4 border-t border-[#E7DED0]/60 dark:border-[#3A291C]/60 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#A66B2D]">
                            Region & Devise
                        </span>
                        <div className="flex items-center gap-2">
                            <CurrencyPicker
                                availableCurrencyCodes={['XAF', 'EUR', 'USD', 'NGN']}
                                activeCurrencyCode="XAF"
                            />
                            <LanguagePicker />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
