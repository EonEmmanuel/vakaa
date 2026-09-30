'use client';

import { Printer } from 'lucide-react';

interface PrintReceiptButtonProps {
    label: string;
    className?: string;
}

export function PrintReceiptButton({ label, className }: PrintReceiptButtonProps) {
    return (
        <button
            type="button"
            onClick={() => {
                if (typeof window !== 'undefined') {
                    window.print();
                }
            }}
            className={
                className ||
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-colors self-start sm:self-auto cursor-pointer'
            }
        >
            <Printer className="size-3.5" />
            {label}
        </button>
    );
}
