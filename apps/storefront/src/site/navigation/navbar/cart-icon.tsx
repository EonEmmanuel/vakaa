'use client';

import {ShoppingBag} from "lucide-react";
import {Button} from "@/components/ui/button";
import { Link } from '@/platform/i18n/navigation';
import {useTranslations} from 'next-intl';

interface CartIconProps {
    cartItemCount: number;
}

export function CartIcon({cartItemCount}: CartIconProps) {
    const t = useTranslations('Navigation');
    return (
        <Button render={<Link href="/cart" />} nativeButton={false} variant="ghost" size="icon" className="relative hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ShoppingBag className="h-5 w-5 stroke-[1.75]"/>
            {cartItemCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-[#D4A43C] text-[#1D120A] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                    {cartItemCount}
                </span>
            )}
            <span className="sr-only">{t('shoppingCart')}</span>
        </Button>
    );
}
