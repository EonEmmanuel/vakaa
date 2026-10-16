import {getRouteLocale} from '@/platform/i18n/server';
import {User} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/platform/i18n/navigation';
import {LoginButton} from "@/site/navigation/navbar/login-button";
import {getActiveCustomer} from '@/features/account/customer';
import {getTranslations} from 'next-intl/server';

export async function NavbarUser() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Navigation'});
    let customer = null;
    try {
        customer = await getActiveCustomer();
    } catch {
        customer = null;
    }

    if (!customer) {
        return (
            <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="icon"
                className="grid size-11 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#1D120A] dark:text-[#fbfaf7] transition-colors cursor-pointer shrink-0"
                aria-label={t('signIn')}
            >
                <User className="size-5 stroke-[1.5]" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="grid size-11 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#1D120A] dark:text-[#fbfaf7] transition-colors cursor-pointer shrink-0"
                        aria-label={t('account')}
                    />
                }
            >
                <User className="size-5 stroke-[1.5]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#fbfaf7] dark:bg-[#1a1916] border-[#e2ddd2] dark:border-[#2e2c28] shadow-lg rounded-xl">
                <DropdownMenuItem render={<Link href="/account/profile" />}>{t('profile')}</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/orders" />}>{t('orders')}</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#e2ddd2] dark:bg-[#2e2c28]" />
                <DropdownMenuItem render={<LoginButton isLoggedIn={true} />} nativeButton />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
