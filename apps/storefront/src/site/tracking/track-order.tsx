'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/platform/i18n/navigation';
import { Package, Truck, Check, FileText, ClipboardCheck, Clock } from "lucide-react";
import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';
import { TrustBar } from '@/components/shared/trust-bar';

export function TrackOrderPage() {
    const router = useRouter();
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trackedOrder, setTrackedOrder] = useState<{
        code: string;
        step: number;
        items: Array<{ name: string; color: string; qty: number; image: string }>;
    } | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const code = orderCode.trim();

        if (!code) {
            setError('Please enter your Order ID.');
            return;
        }

        setIsSearching(true);
        // Simulate immediate tracker retrieval or redirect
        setTimeout(() => {
            setIsSearching(false);
            setTrackedOrder({
                code: code.toUpperCase(),
                step: 2, // Accepted / In Progress
                items: [
                    { name: 'Cabas Majestueux Raphia & Cuir', color: 'Ebony & Gold', qty: 1, image: '/images/cat-tote.jpg' },
                    { name: 'Pochette Signature Adinkra', color: 'Natural Tan', qty: 2, image: '/images/cat-clutch.jpg' },
                ],
            });
        }, 600);
    };

    const statusSteps = [
        { label: 'Order Placed', icon: FileText, date: '20 Apr 2026', time: '11:00 AM' },
        { label: 'Accepted', icon: ClipboardCheck, date: '20 Apr 2026', time: '11:15 AM' },
        { label: 'In Progress', icon: Package, date: 'Expected 21 Apr' },
        { label: 'On the Way', icon: Truck, date: 'Expected 22-23 Apr' },
        { label: 'Delivered', icon: Check, date: 'Expected 24 Apr' },
    ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen text-[#1D120A] flex flex-col">
            {/* 1. Centered Breadcrumb Hero Banner (Matching reference bfe211195762505.69ca92c633407.png) */}
            <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center transition-colors">
                <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>
                <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-70 transform rotate-180">
                    <DecorativeDotCluster className="w-full h-full" />
                </div>

                <div className="vakaa-container relative z-10 space-y-3 max-w-3xl mx-auto">
                    <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1D120A] leading-tight">
                        Track Your Order
                    </h1>

                    <nav aria-label="Fil d'ariane" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#3A2418]/60 pt-1">
                        <Link href="/" className="hover:text-[#D4A43C] transition-colors cursor-pointer">
                            Home
                        </Link>
                        <span className="text-[#3A2418]/30">/</span>
                        <span className="font-semibold text-[#1D120A]">
                            Track Your Order
                        </span>
                    </nav>
                </div>
            </section>

            {/* 2. Main Tracking Content */}
            <main className="vakaa-container py-14 sm:py-20 flex-1 max-w-4xl mx-auto space-y-12">
                {/* Search Form Card */}
                <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-6">
                    <p className="text-xs sm:text-sm text-[#3A2418]/80 leading-relaxed font-sans max-w-2xl">
                        To track your order please enter your Order ID in the box below and press the &ldquo;Track Order&rdquo; button. This was given to you on your receipt and in the confirmation email you should have received.
                    </p>

                    <form onSubmit={handleSearch} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#1D120A] block">
                                Order ID *
                            </label>
                            <input
                                type="text"
                                required
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value)}
                                placeholder="Enter Your Order ID"
                                className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#1D120A] block">
                                Billing Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email Address"
                                className="w-full bg-white border border-[#E7DED0] px-5 py-3.5 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all placeholder:text-[#3A2418]/30 text-[#1D120A]"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-600 font-medium">
                                {error}
                            </p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="inline-flex items-center justify-center gap-2 bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] rounded-full px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <>
                                        <Clock className="w-4 h-4 animate-spin" />
                                        <span>Tracking...</span>
                                    </>
                                ) : (
                                    <span>Track Order</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Stepped Order Status Card (Matching e7a56a195762505.69ca92c633a81.png) */}
                {trackedOrder && (
                    <div className="space-y-8 pt-6">
                        <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-8">
                            <div className="space-y-1">
                                <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#1D120A]">
                                    Order Status
                                </h2>
                                <p className="text-xs sm:text-sm text-[#3A2418]/70">
                                    Order ID : <span className="font-semibold text-[#1D120A]">#{trackedOrder.code}</span>
                                </p>
                            </div>

                            {/* Stepper timeline */}
                            <div className="relative pt-4 pb-2">
                                <div className="grid grid-cols-5 gap-2 relative z-10">
                                    {statusSteps.map((s, idx) => {
                                        const StepIcon = s.icon;
                                        const isDone = idx <= trackedOrder.step;
                                        return (
                                            <div key={idx} className="flex flex-col items-center text-center space-y-2">
                                                {/* Top icon */}
                                                <div className="size-10 rounded-xl bg-[#F3EFE9] flex items-center justify-center text-[#D4A43C] mb-1">
                                                    <StepIcon className="w-5 h-5" />
                                                </div>

                                                <span className="text-xs font-semibold text-[#1D120A] hidden sm:block">
                                                    {s.label}
                                                </span>

                                                {/* Status Check / Dot */}
                                                <div
                                                    className={`size-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                                                        isDone ? 'bg-[#1D120A] text-[#FAF8F5]' : 'bg-[#E7DED0]'
                                                    }`}
                                                >
                                                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>

                                                <div className="text-[11px] text-[#3A2418]/60 space-y-0.5">
                                                    <p>{s.date}</p>
                                                    {s.time && <p className="text-[10px]">{s.time}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Ordered Products Card */}
                        <div className="bg-[#FAF8F5] border border-[#E7DED0]/80 rounded-3xl p-8 sm:p-10 space-y-6">
                            <h3 className="font-sans text-lg font-bold text-[#1D120A]">
                                Products
                            </h3>

                            <div className="space-y-4 divide-y divide-[#E7DED0]/60">
                                {trackedOrder.items.map((item, idx) => (
                                    <div key={idx} className="pt-4 first:pt-0 flex items-center gap-4">
                                        <div className="size-16 rounded-2xl bg-[#F3EFE9] border border-[#E7DED0] overflow-hidden shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-sans text-sm font-bold text-[#1D120A]">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-[#3A2418]/70">
                                                Color : {item.color} | {item.qty} Qty.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* 3. Universal Trust Bar */}
            <TrustBar />
        </div>
    );
}
