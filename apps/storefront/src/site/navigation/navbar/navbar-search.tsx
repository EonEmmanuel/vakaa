import {Link} from '@/platform/i18n/navigation';
import {Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';

export async function NavbarSearch() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Navigation'});

    return (
        <Button
            render={<Link href="/search" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            className="w-9 h-9 flex items-center justify-center text-[#1D120A] dark:text-[#F8F4EE] hover:text-[#D4A43C] hover:bg-transparent transition-colors cursor-pointer"
            aria-label={t('searchProducts')}
        >
            <Search className="h-5 w-5 stroke-[1.5]" />
        </Button>
    );
}
