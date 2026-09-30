import {redirect} from '@/platform/i18n/navigation';
import {getRouteLocale} from '@/platform/i18n/server';

export default async function AccountRootPage() {
    const locale = await getRouteLocale();
    redirect({href: '/account/profile', locale});
}
