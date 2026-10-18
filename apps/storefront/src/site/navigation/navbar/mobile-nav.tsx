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
        { key: 'home' as const, href: '/', icon: Home, isActive: pathname === '/' },
        { key: 'shopAll' as const, href: '/search', icon: ShoppingBag, isActive: pathname === '/search' || pathname.startsWith('/collection/') || pathname.startsWith('/product/') },
        { key: 'ourStory' as const, href: '/our-story', icon: Compass, isActive: pathname === '/our-story' },
        { key: 'artisans' as const, href: '/artisans', icon: User, isActive: pathname === '/artisans' },
        { key: 'journal' as const, href: '/journal', icon: BookOpen, isActive: pathname === '/journal' },
        { key: 'contact' as const, href: '/contact', icon: Mail, isActive: pathname === '/contact' },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="grid size-11 place-items-center rounded-full lg:hidden hover:bg-black/5 dark:hover:bg-white/5 text-[#1D120A] dark:text-[#fbfaf7] cursor-pointer shrink-0" />}>
                <Menu className="size-5" />
                <span className="sr-only">{t('openMenu')}</span>
            </SheetTrigger>
            <SheetContent side="right" data-lenis-prevent className="w-full sm:max-w-sm overflow-y-auto bg-[#f2efe9] dark:bg-[#151413] border-l border-[#e2ddd2] dark:border-[#2e2c28]">
                <SheetHeader>
                    <SheetTitle className="font-display font-bold text-[#1c1b18] dark:text-[#fbfaf7] text-lg">{t('menu')}</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-4 pb-6">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7d796f]" />
                        <Input
                            type="search"
                            placeholder={t('searchProducts')}
                            className="pl-9 w-full bg-[#fbfaf7] dark:bg-[#1c1b19] border-[#e2ddd2] dark:border-[#2e2c28] text-[#1c1b18] dark:text-[#fbfaf7] placeholder:text-[#7d796f] rounded-xl focus-visible:ring-[#D4A43C]"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </form>

                    {/* Editorial & Navigation Links */}
                    <div>
                        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A43C] dark:text-[#D4A43C]">
                            {t('explore')}
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
                                                    className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-standard)] motion-reduce:transition-none hover:translate-x-0.5 ${
                                                        item.isActive
                                                            ? 'bg-[#ebe2d4] dark:bg-[#272522] text-[#1c1b18] dark:text-[#fbfaf7] font-semibold border-l-3 border-[#D4A43C] dark:border-[#D4A43C]'
                                                            : 'text-[#57544c] dark:text-[#a6a29a] hover:bg-[#ebe2d4]/50 dark:hover:bg-[#272522]/50 hover:text-[#1c1b18] dark:hover:text-[#fbfaf7]'
                                                    }`}
                                                />
                                            }
                                            nativeButton={false}
                                            onClick={handleLinkClick}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`h-4 w-4 ${item.isActive ? 'text-[#D4A43C] dark:text-[#D4A43C]' : 'text-[#7d796f]'}`} />
                                                <span>{t(item.key)}</span>
                                            </div>
                                            {item.isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C] dark:bg-[#D4A43C]" />
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
                            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A43C] dark:text-[#D4A43C]">
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
                                                    className={`flex items-center justify-between px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        isColActive
                                                            ? 'bg-[#ebe2d4] dark:bg-[#272522] text-[#1c1b18] dark:text-[#fbfaf7] font-semibold'
                                                            : 'text-[#57544c] dark:text-[#a6a29a] hover:bg-[#ebe2d4]/40 dark:hover:bg-[#272522]/40'
                                                    }`}
                                                />
                                            }
                                            nativeButton={false}
                                            onClick={handleLinkClick}
                                        >
                                            <span>{collection.name}</span>
                                            {isColActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C] dark:bg-[#D4A43C]" />}
                                        </SheetClose>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Account links */}
                    <div>
                        <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A43C] dark:text-[#D4A43C]">
                            {t('account')}
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/profile"
                                        className={`flex items-center gap-3 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            pathname === '/account/profile'
                                                ? 'bg-[#ebe2d4] dark:bg-[#272522] font-semibold text-[#1c1b18] dark:text-[#fbfaf7]'
                                                : 'text-[#57544c] dark:text-[#a6a29a] hover:bg-[#ebe2d4]/40 dark:hover:bg-[#272522]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <User className="h-4 w-4 text-[#7d796f]" />
                                {t('profile')}
                            </SheetClose>
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/orders"
                                        className={`flex items-center gap-3 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            pathname.startsWith('/account/orders')
                                                ? 'bg-[#ebe2d4] dark:bg-[#272522] font-semibold text-[#1c1b18] dark:text-[#fbfaf7]'
                                                : 'text-[#57544c] dark:text-[#a6a29a] hover:bg-[#ebe2d4]/40 dark:hover:bg-[#272522]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <Package className="h-4 w-4 text-[#7d796f]" />
                                {t('orders')}
                            </SheetClose>
                            <SheetClose
                                render={
                                    <Link
                                        href="/account/addresses"
                                        className={`flex items-center gap-3 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            pathname === '/account/addresses'
                                                ? 'bg-[#ebe2d4] dark:bg-[#272522] font-semibold text-[#1c1b18] dark:text-[#fbfaf7]'
                                                : 'text-[#57544c] dark:text-[#a6a29a] hover:bg-[#ebe2d4]/40 dark:hover:bg-[#272522]/40'
                                        }`}
                                    />
                                }
                                nativeButton={false}
                                onClick={handleLinkClick}
                            >
                                <MapPin className="h-4 w-4 text-[#7d796f]" />
                                {t('addresses')}
                            </SheetClose>
                        </nav>
                    </div>

                    {/* Regional Settings */}
                    <div className="pt-4 border-t border-[#e2ddd2] dark:border-[#2e2c28] flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#57544c] dark:text-[#a6a29a]">
                            Région & Devise
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
