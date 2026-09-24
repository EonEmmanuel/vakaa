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
                className="w-9 h-9 flex items-center justify-center text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] hover:bg-transparent transition-colors cursor-pointer"
                aria-label={t('signIn')}
            >
                <User className="h-5 w-5 stroke-[1.5]" />
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
                        className="w-9 h-9 flex items-center justify-center text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] hover:bg-transparent transition-colors cursor-pointer"
                        aria-label={t('account')}
                    />
                }
            >
                <User className="h-5 w-5 stroke-[1.5]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#F8F4EE] dark:bg-[#20150D] border-[#E7DED0] dark:border-[#3A291C]">
                <DropdownMenuItem render={<Link href="/account/profile" />}>{t('profile')}</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/orders" />}>{t('orders')}</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E7DED0] dark:bg-[#3A291C]" />
                <DropdownMenuItem render={<LoginButton isLoggedIn={true} />} nativeButton />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
