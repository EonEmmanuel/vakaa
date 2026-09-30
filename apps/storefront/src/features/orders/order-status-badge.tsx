import {
    ShoppingCart,
    CreditCard,
    Clock,
    CheckCircle,
    Truck,
    PackageCheck,
    Package,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const STATUS_CONFIG: Record<string, { color: string; icon: LucideIcon }> = {
    AddingItems: { color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300', icon: ShoppingCart },
    ArrangingPayment: { color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800', icon: CreditCard },
    PaymentAuthorized: { color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800', icon: Clock },
    PaymentSettled: { color: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle },
    PartiallyShipped: { color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800', icon: Package },
    Shipped: { color: 'bg-[#1B3B2B]/10 text-[#1B3B2B] border-[#1B3B2B]/20 dark:bg-[#D4A43C]/10 dark:text-[#D4A43C]', icon: Truck },
    PartiallyDelivered: { color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: PackageCheck },
    Delivered: { color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200', icon: PackageCheck },
    Cancelled: { color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800', icon: XCircle },
};

interface OrderStatusBadgeProps {
    state: string;
}

export function OrderStatusBadge({ state }: OrderStatusBadgeProps) {
    const t = useTranslations('OrderStatus');
    const config = STATUS_CONFIG[state] || { color: 'bg-stone-100 text-stone-700', icon: Clock };
    const Icon = config.icon;
    const label = state in STATUS_CONFIG ? t(state as keyof typeof STATUS_CONFIG) : state;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
        </span>
    );
}
