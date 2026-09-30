'use client';

import {useLocale, useTranslations} from 'next-intl';
import {routing, localeNames, type Locale} from '@/platform/i18n/routing';
import {Globe, Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguagePicker() {
    const locale = useLocale();
    const t = useTranslations('Navigation');

    const handleLocaleChange = (newLocale: string) => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const segments = currentPath.split('/');
            if (segments[1] && routing.locales.includes(segments[1] as Locale)) {
                segments[1] = newLocale;
                window.location.href = segments.join('/') + window.location.search;
            } else {
                window.location.href = `/${newLocale}${currentPath}${window.location.search}`;
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs font-medium"
                        aria-label={t('switchLanguage')}
                    />
                }
            >
                <Globe className="size-3.5 text-[#D4A43C]" />
                <span className="font-semibold uppercase tracking-wider">{locale}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 p-1">
                {routing.locales.map((loc) => {
                    const isSelected = locale === loc;
                    return (
                        <DropdownMenuItem
                            key={loc}
                            onClick={() => handleLocaleChange(loc)}
                            className="flex items-center justify-between text-xs cursor-pointer py-1.5 px-2 rounded-md"
                        >
                            <span className={isSelected ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                                {localeNames[loc] ?? loc.toUpperCase()}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A43C]" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
