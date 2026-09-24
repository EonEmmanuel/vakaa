import { defineDashboardExtension } from '@/vdb/framework/extension-api/define-dashboard-extension.js';
import * as React from 'react';

// ============================================================================
// 0. High-Performance Authenticated GraphQL Client for VAKAA Dashboard
// ============================================================================

const LS_KEY_SESSION_TOKEN = 'vendure-session-token';
const LS_KEY_SELECTED_CHANNEL_TOKEN = 'vendure-selected-channel-token';
const LS_KEY_USER_SETTINGS = 'vendure-user-settings';

export const BENTO_OPTIMAL_LAYOUT = {
    'vakaa-hero-greeting': { x: 0, y: 0, w: 12, h: 1 },
    'vakaa-sales-analytics': { x: 0, y: 1, w: 8, h: 3 },
    'vakaa-spotlight-products': { x: 8, y: 1, w: 4, h: 3 },
    'vakaa-kpi-row': { x: 0, y: 4, w: 12, h: 1 },
    'vakaa-recent-orders': { x: 0, y: 5, w: 12, h: 3 },
};

// One-time auto-migration flag: cleans up legacy oversized heights once, then NEVER touches user-saved layouts
const MIGRATION_FLAG_KEY = 'vakaa-layout-migrated-v3';
if (typeof window !== 'undefined') {
    try {
        if (!localStorage.getItem(MIGRATION_FLAG_KEY)) {
            const stored = localStorage.getItem(LS_KEY_USER_SETTINGS);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.widgetLayout) {
                    parsed.widgetLayout = {
                        ...parsed.widgetLayout,
                        ...BENTO_OPTIMAL_LAYOUT,
                    };
                    localStorage.setItem(LS_KEY_USER_SETTINGS, JSON.stringify(parsed));
                }
            }
            localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
        }
    } catch (e) {
        console.warn('[VAKAA Layout Migration]', e);
    }
}

async function adminApiQuery<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY_SESSION_TOKEN) : null;
    const channelToken = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY_SELECTED_CHANNEL_TOKEN) : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    if (channelToken) {
        headers['vendure-token'] = channelToken;
    }

    const res = await fetch('/admin-api', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ query, variables }),
    });

    const authToken = res.headers.get('vendure-auth-token');
    if (authToken && typeof window !== 'undefined') {
        localStorage.setItem(LS_KEY_SESSION_TOKEN, authToken);
    }

    if (!res.ok) {
        throw new Error(`Admin API HTTP error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
        console.warn('[VAKAA Admin API] GraphQL Errors:', json.errors);
        throw new Error(json.errors[0]?.message || 'GraphQL Query Error');
    }

    return json.data as T;
}

const ZERO_DECIMAL_CURRENCIES = new Set(['XAF', 'XOF', 'JPY', 'KRW', 'CLP', 'VND', 'BIF', 'DJF', 'GNF', 'KMF', 'RWF', 'UGX']);

function formatCurrency(cents: number, currencyCode = 'XAF', locale = 'fr-FR'): string {
    const amount = (cents || 0) / 100;
    const isZeroDec = ZERO_DECIMAL_CURRENCIES.has((currencyCode || 'XAF').toUpperCase());
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode || 'XAF',
            minimumFractionDigits: isZeroDec ? 0 : 2,
            maximumFractionDigits: isZeroDec ? 0 : 2,
        }).format(amount);
    } catch {
        if (currencyCode === 'XAF' || currencyCode === 'XOF') {
            return `${Math.round(amount).toLocaleString(locale)} FCFA`;
        }
        return `${currencyCode} ${amount.toFixed(isZeroDec ? 0 : 2)}`;
    }
}

function formatOrderDate(dateInput: string | Date | undefined): string {
    if (!dateInput) return '—';
    try {
        const d = new Date(dateInput);
        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return String(dateInput);
    }
}

// ============================================================================
// 1. Login Page Branding Components
// ============================================================================

export function VakaaLoginLogo() {
    return (
        <div className="flex items-center justify-center mb-1">
            <span
                style={{
                    fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    letterSpacing: '0.24em',
                    color: '#D4A43C',
                    textShadow: '0 2px 10px rgba(212, 164, 60, 0.25)',
                    paddingLeft: '0.24em',
                }}
            >
                VAKAA
            </span>
        </div>
    );
}

export function VakaaLoginHeader() {
    return (
        <div className="flex flex-col items-center text-center gap-2">
            <h1
                className="text-2xl font-semibold tracking-tight text-foreground"
                style={{
                    fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
                    letterSpacing: '0.04em',
                }}
            >
                Welcome to VAKAA
            </h1>
            <p className="text-sm text-muted-foreground">
                Sign in to manage your luxury boutique
            </p>
        </div>
    );
}

// ============================================================================
// 2. Bento Grid: Hero Greeting & Status Banner (h: 1, 100px snug height)
// ============================================================================

interface AdminUser {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
}

export function VakaaHeroGreetingWidget() {
    const [greeting, setGreeting] = React.useState('Good Day');
    const [todayStr, setTodayStr] = React.useState('');
    const [adminName, setAdminName] = React.useState<string>('Director');
    const [stats, setStats] = React.useState<{ products: number; orders: number } | null>(null);

    React.useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        setTodayStr(new Date().toLocaleDateString('en-GB', options));

        adminApiQuery<{
            activeAdministrator?: AdminUser;
            products: { totalItems: number };
            orders: { totalItems: number };
        }>(`
            query GetDashboardGreetingData {
                activeAdministrator {
                    firstName
                    lastName
                    emailAddress
                }
                products(options: { take: 1 }) {
                    totalItems
                }
                orders(options: { take: 1 }) {
                    totalItems
                }
            }
        `)
            .then((data) => {
                if (data?.activeAdministrator) {
                    const first = data.activeAdministrator.firstName?.trim();
                    const last = data.activeAdministrator.lastName?.trim();
                    const full = [first, last].filter(Boolean).join(' ');
                    setAdminName(full || first || 'Director');
                }
                if (data?.products && data?.orders) {
                    setStats({
                        products: data.products.totalItems,
                        orders: data.orders.totalItems,
                    });
                }
            })
            .catch((err) => {
                console.warn('[VAKAA Hero] Could not load active admin info:', err);
            });
    }, []);

    return (
        <div className="w-full h-full bg-card text-card-foreground rounded-2xl px-6 py-3 border border-border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 box-border">
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3">
                    <h1
                        className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-tight"
                        style={{ fontFamily: 'var(--font-heading, "Playfair Display", serif)' }}
                    >
                        {greeting}, {adminName}!
                    </h1>
                    {stats && (
                        <div className="hidden sm:inline-flex items-center gap-2 text-xs text-muted-foreground ml-2">
                            <span className="inline-flex items-center gap-1 font-medium text-foreground bg-secondary/60 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C]" />
                                {stats.products} Pieces
                            </span>
                            <span className="inline-flex items-center gap-1 font-medium text-foreground bg-secondary/60 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {stats.orders} Orders
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time boutique performance across your luxury channels.
                </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-secondary/40 text-xs font-medium text-foreground">
                    <svg className="w-3.5 h-3.5 text-[#D4A43C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{todayStr}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4A43C]/10 border border-[#D4A43C]/30 text-xs font-semibold text-[#D4A43C]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C] animate-pulse" />
                    <span>Live</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// 3. Bento Grid: Sales Analytics with Spline Curve (h: 3, 320px snug height)
// ============================================================================

interface ChartPoint {
    label: string;
    rawDate: string;
    sales: number;
    orders: number;
    x: number;
    y: number;
}

export function VakaaSalesAnalyticsWidget() {
    const [timeframe, setTimeframe] = React.useState<'7d' | '30d' | '90d' | '12m'>('30d');
    const [points, setPoints] = React.useState<ChartPoint[]>([]);
    const [totalPeriodRevenue, setTotalPeriodRevenue] = React.useState<number>(0);
    const [totalPeriodOrders, setTotalPeriodOrders] = React.useState<number>(0);
    const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [currencyCode, setCurrencyCode] = React.useState('XAF');

    const timeframes = ['7d', '30d', '90d', '12m'] as const;

    React.useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const now = new Date();
        const start = new Date();
        if (timeframe === '7d') start.setDate(now.getDate() - 7);
        else if (timeframe === '30d') start.setDate(now.getDate() - 30);
        else if (timeframe === '90d') start.setDate(now.getDate() - 90);
        else if (timeframe === '12m') start.setFullYear(now.getFullYear() - 1);

        adminApiQuery<{
            activeChannel?: { defaultCurrencyCode: string };
            dashboardMetricSummary: Array<{
                type: 'OrderTotal' | 'OrderCount' | 'AverageOrderValue';
                entries: Array<{ label: string; value: number }>;
            }>;
        }>(`
            query GetSalesMetrics($start: DateTime!, $end: DateTime!) {
                activeChannel {
                    defaultCurrencyCode
                }
                dashboardMetricSummary(input: {
                    types: [OrderTotal, OrderCount],
                    refresh: true,
                    startDate: $start,
                    endDate: $end
                }) {
                    type
                    entries {
                        label
                        value
                    }
                }
            }
        `, { start: start.toISOString(), end: now.toISOString() })
            .then((res) => {
                if (!isMounted) return;

                if (res.activeChannel?.defaultCurrencyCode) {
                    setCurrencyCode(res.activeChannel.defaultCurrencyCode);
                }

                const totalsEntry = res.dashboardMetricSummary?.find((m) => m.type === 'OrderTotal');
                const countsEntry = res.dashboardMetricSummary?.find((m) => m.type === 'OrderCount');

                const totalEntries = totalsEntry?.entries || [];
                const countEntries = countsEntry?.entries || [];

                let periodRevenue = 0;
                let periodOrders = 0;

                totalEntries.forEach((e) => { periodRevenue += e.value || 0; });
                countEntries.forEach((e) => { periodOrders += e.value || 0; });

                setTotalPeriodRevenue(periodRevenue);
                setTotalPeriodOrders(periodOrders);

                const entriesToRender = totalEntries.length > 30
                    ? totalEntries.filter((_, idx) => idx % Math.ceil(totalEntries.length / 24) === 0)
                    : totalEntries;

                const maxVal = Math.max(...entriesToRender.map((e) => e.value), 100);
                const svgW = 760;
                const svgH = 175;
                const paddingX = 35;
                const paddingY = 20;
                const drawW = svgW - paddingX * 2;
                const drawH = svgH - paddingY * 2;

                const computedPoints: ChartPoint[] = entriesToRender.map((entry, idx) => {
                    const matchedCount = countEntries.find((c) => c.label === entry.label)?.value || 0;
                    const x = entriesToRender.length > 1
                        ? paddingX + (idx / (entriesToRender.length - 1)) * drawW
                        : paddingX + drawW / 2;
                    const y = svgH - paddingY - (entry.value / maxVal) * drawH;

                    const dateObj = new Date(entry.label);
                    const label = timeframe === '12m'
                        ? dateObj.toLocaleDateString('en-GB', { month: 'short' })
                        : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                    return {
                        label,
                        rawDate: entry.label,
                        sales: entry.value,
                        orders: matchedCount,
                        x,
                        y,
                    };
                });

                setPoints(computedPoints);
                setHoveredIdx(computedPoints.length > 0 ? computedPoints.length - 1 : null);
                setLoading(false);
            })
            .catch((err) => {
                console.error('[VAKAA Sales Chart] Failed to fetch metric summary:', err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [timeframe]);

    let pathD = '';
    let areaD = '';
    let ordersPathD = '';

    if (points.length > 1) {
        pathD = `M ${points[0].x},${points[0].y}`;
        ordersPathD = `M ${points[0].x},${points[0].y + 8}`;

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cx1 = curr.x + (next.x - curr.x) / 2;
            const cy1 = curr.y;
            const cx2 = curr.x + (next.x - curr.x) / 2;
            const cy2 = next.y;
            pathD += ` C ${cx1},${cy1} ${cx2},${cy2} ${next.x},${next.y}`;

            const oY1 = Math.min(150, curr.y + 8);
            const oY2 = Math.min(150, next.y + 8);
            ordersPathD += ` C ${cx1},${oY1} ${cx2},${oY2} ${next.x},${oY2}`;
        }
        areaD = `${pathD} L ${points[points.length - 1].x},155 L ${points[0].x},155 Z`;
    }

    const activePoint = hoveredIdx !== null && points[hoveredIdx] ? points[hoveredIdx] : null;

    return (
        <div className="w-full h-full bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-between overflow-hidden box-border">
            {/* Top Bar: Title & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-foreground">Boutique Sales & Velocity</h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {totalPeriodOrders} {totalPeriodOrders === 1 ? 'Order' : 'Orders'}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span
                            className="text-2xl font-bold tracking-tight text-foreground"
                            style={{ fontFamily: 'var(--font-heading, "Playfair Display", serif)' }}
                        >
                            {loading ? '—' : formatCurrency(totalPeriodRevenue, currencyCode)}
                        </span>
                    </div>
                </div>

                {/* Timeframe Pill Buttons */}
                <div className="inline-flex p-0.5 rounded-full bg-secondary/60 border border-border shrink-0 self-start sm:self-auto">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                                timeframe === tf
                                    ? 'bg-[#D4A43C] text-[#140C06] shadow-sm font-bold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spline Chart SVG */}
            <div className="relative w-full flex-1 min-h-[160px] select-none mt-1">
                {loading ? (
                    <div className="w-full h-full vakaa-skeleton flex items-center justify-center text-xs text-muted-foreground font-medium">
                        Loading live metrics...
                    </div>
                ) : points.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">No transaction data for this timeframe</p>
                        <p className="text-[11px] mt-1">Orders placed will chart here in real time.</p>
                    </div>
                ) : (
                    <>
                        <svg viewBox="0 0 760 175" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="vakaaGoldGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#D4A43C" stopOpacity="0.22" />
                                    <stop offset="100%" stopColor="#D4A43C" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            <line x1="35" y1="155" x2="725" y2="155" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
                            <line x1="35" y1="95" x2="725" y2="95" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="35" y1="35" x2="725" y2="35" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />

                            {areaD && <path d={areaD} fill="url(#vakaaGoldGradient)" />}

                            {ordersPathD && (
                                <path
                                    d={ordersPathD}
                                    fill="none"
                                    stroke="#A18E81"
                                    strokeWidth="1.75"
                                    strokeOpacity="0.4"
                                    strokeLinecap="round"
                                />
                            )}

                            {pathD && (
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#D4A43C"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            )}

                            {points.map((p, idx) => (
                                <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)}>
                                    {hoveredIdx === idx && (
                                        <line
                                            x1={p.x}
                                            y1="25"
                                            x2={p.x}
                                            y2="155"
                                            stroke="#D4A43C"
                                            strokeDasharray="3 3"
                                            strokeWidth="1.5"
                                            strokeOpacity="0.7"
                                        />
                                    )}
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={hoveredIdx === idx ? '5' : '3'}
                                        fill={hoveredIdx === idx ? '#D4A43C' : 'var(--card, #FFFFFF)'}
                                        stroke="#D4A43C"
                                        strokeWidth={hoveredIdx === idx ? '2.5' : '1.5'}
                                    />
                                </g>
                            ))}

                            {points.map((p, idx) => {
                                const shouldShow = points.length <= 12 || idx % Math.ceil(points.length / 8) === 0;
                                if (!shouldShow) return null;
                                return (
                                    <text
                                        key={idx}
                                        x={p.x}
                                        y="170"
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="currentColor"
                                        className="fill-muted-foreground font-medium"
                                    >
                                        {p.label}
                                    </text>
                                );
                            })}
                        </svg>

                        {activePoint && (
                            <div
                                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-[#140C06] text-[#F8F4EE] shadow-xl border border-[#D4A43C]/40 text-xs flex flex-col gap-0.5 transition-all duration-150 z-10"
                                style={{
                                    left: `${(activePoint.x / 760) * 100}%`,
                                    top: `${(activePoint.y / 175) * 100 - 8}%`,
                                }}
                            >
                                <p className="font-semibold text-[#D4A43C] text-[11px]">{activePoint.label}</p>
                                <p className="text-[10px] opacity-95">{formatCurrency(activePoint.sales, currencyCode)}</p>
                                <p className="text-[10px] text-stone-400">{activePoint.orders} Orders</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// 4. Bento Grid: Boutique Spotlight (h: 3, 320px snug height)
// ============================================================================

interface SpotlightProduct {
    id: string;
    name: string;
    slug: string;
    preview?: string;
    price: number;
    currencyCode?: string;
    collectionName?: string;
    stockLevel?: string;
}

export function VakaaSpotlightWidget() {
    const [products, setProducts] = React.useState<SpotlightProduct[]>([]);
    const [activeIdx, setActiveIdx] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        adminApiQuery<{
            activeChannel?: { defaultCurrencyCode: string };
            products: {
                totalItems: number;
                items: Array<{
                    id: string;
                    name: string;
                    slug: string;
                    featuredAsset?: { preview: string };
                    variants: Array<{ priceWithTax: number; currencyCode?: string; stockLevel: string }>;
                    collections: Array<{ name: string }>;
                }>;
            };
        }>(`
            query GetSpotlightCatalog {
                activeChannel {
                    defaultCurrencyCode
                }
                products(options: { take: 8, sort: { createdAt: DESC } }) {
                    totalItems
                    items {
                        id
                        name
                        slug
                        featuredAsset {
                            preview
                        }
                        variants {
                            priceWithTax
                            currencyCode
                            stockLevel
                        }
                        collections {
                            name
                        }
                    }
                }
            }
        `)
            .then((res) => {
                if (!isMounted) return;
                const channelCurrency = res.activeChannel?.defaultCurrencyCode || 'XAF';
                const items = res.products?.items || [];
                const formatted: SpotlightProduct[] = items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    preview: item.featuredAsset?.preview,
                    price: item.variants?.[0]?.priceWithTax || 0,
                    currencyCode: item.variants?.[0]?.currencyCode || channelCurrency,
                    collectionName: item.collections?.[0]?.name || 'Flagship Edition',
                    stockLevel: item.variants?.[0]?.stockLevel || 'IN_STOCK',
                }));
                setProducts(formatted);
                setLoading(false);
            })
            .catch((err) => {
                console.error('[VAKAA Spotlight] Failed to fetch products:', err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full bg-card rounded-2xl p-5 border border-border shadow-sm vakaa-skeleton flex items-center justify-center text-xs text-muted-foreground box-border">
                Loading boutique spotlight...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="w-full h-full bg-card rounded-2xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center p-4 box-border">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-[#D4A43C] mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h4 className="font-semibold text-xs text-foreground">Catalog Ready</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Add items under Catalog.</p>
            </div>
        );
    }

    const current = products[activeIdx] || products[0];

    return (
        <div className="w-full h-full bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-between overflow-hidden box-border">
            <div className="flex items-center justify-between shrink-0">
                <h3 className="text-sm font-semibold text-foreground">Boutique Spotlight</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D4A43C]/15 text-[#D4A43C]">
                    {current.stockLevel === 'IN_STOCK' ? 'Available' : 'Limited'}
                </span>
            </div>

            {/* Spotlight Showcase Card */}
            <div className="my-1.5 p-3 rounded-xl border border-border bg-gradient-to-br from-[#D4A43C]/5 to-transparent flex flex-col items-center text-center relative overflow-hidden flex-1 justify-center">
                <div className="w-20 h-20 rounded-xl bg-secondary/80 border border-border flex items-center justify-center mb-2 shadow-sm overflow-hidden shrink-0">
                    {current.preview ? (
                        <img
                            src={current.preview}
                            alt={current.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <span
                            className="text-2xl font-bold text-[#D4A43C]"
                            style={{ fontFamily: 'var(--font-heading, "Playfair Display", serif)' }}
                        >
                            V
                        </span>
                    )}
                </div>
                <h4 className="font-semibold text-xs text-foreground line-clamp-1">{current.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{current.collectionName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-foreground">{formatCurrency(current.price, current.currencyCode)}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-[#D4A43C] font-semibold">ID #{current.id}</span>
                </div>
            </div>

            {/* Carousel navigation */}
            <div className="flex items-center justify-between pt-1 shrink-0">
                <div className="flex gap-1.5">
                    {products.slice(0, 6).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIdx(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                activeIdx === i ? 'bg-[#D4A43C] w-3.5' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                            }`}
                        />
                    ))}
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : products.length - 1))}
                        className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Previous piece"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setActiveIdx((prev) => (prev < products.length - 1 ? prev + 1 : 0))}
                        className="p-1 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Next piece"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// 5. Bento Grid: 4-Tile KPI Metric Cards (h: 1, 100px snug height)
// ============================================================================

export function VakaaKpiRowWidget() {
    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState<{
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
        totalCollections: number;
        currencyCode: string;
    }>({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCollections: 0,
        currencyCode: 'XAF',
    });

    React.useEffect(() => {
        let isMounted = true;
        adminApiQuery<{
            activeChannel?: { defaultCurrencyCode: string };
            products: { totalItems: number };
            orders: {
                totalItems: number;
                items: Array<{ totalWithTax: number; currencyCode: string; state: string }>;
            };
            collections: { totalItems: number };
        }>(`
            query GetLiveKpis {
                activeChannel {
                    defaultCurrencyCode
                }
                products(options: { take: 1 }) {
                    totalItems
                }
                orders(options: { take: 100 }) {
                    totalItems
                    items {
                        totalWithTax
                        currencyCode
                        state
                    }
                }
                collections(options: { take: 1 }) {
                    totalItems
                }
            }
        `)
            .then((res) => {
                if (!isMounted) return;
                const totalProducts = res.products?.totalItems || 0;
                const totalOrders = res.orders?.totalItems || 0;
                const totalCollections = res.collections?.totalItems || 0;
                const channelCurrency = res.activeChannel?.defaultCurrencyCode || 'XAF';

                let sum = 0;
                let currency = channelCurrency;
                if (res.orders?.items) {
                    for (const o of res.orders.items) {
                        sum += o.totalWithTax || 0;
                        if (o.currencyCode) currency = o.currencyCode;
                    }
                }

                setData({
                    totalProducts,
                    totalOrders,
                    totalRevenue: sum,
                    totalCollections,
                    currencyCode: currency,
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error('[VAKAA KPI] Failed to fetch live metrics:', err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const kpis = [
        {
            label: 'Curated pieces',
            value: loading ? '—' : String(data.totalProducts),
            icon: (
                <svg className="w-4 h-4 text-[#D4A43C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
            ),
            badge: `${data.totalProducts} Items`,
            badgeColor: 'bg-[#D4A43C]/10 text-[#D4A43C]',
        },
        {
            label: 'Total boutique orders',
            value: loading ? '—' : String(data.totalOrders),
            icon: (
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            ),
            badge: data.totalOrders > 0 ? 'Live Orders' : 'Ready',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Boutique revenue',
            value: loading ? '—' : formatCurrency(data.totalRevenue, data.currencyCode),
            icon: (
                <svg className="w-4 h-4 text-[#D4A43C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3h12l4 6-10 12L2 9Z" />
                    <path d="M11 3 8 9l4 12 4-12-3-6" />
                    <path d="M2 9h20" />
                </svg>
            ),
            badge: data.totalRevenue > 0 ? 'Settled' : 'Initial',
            badgeColor: 'bg-[#D4A43C]/15 text-[#D4A43C]',
        },
        {
            label: 'Boutique collections',
            value: loading ? '—' : String(data.totalCollections),
            icon: (
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
            ),
            badge: `${data.totalCollections} Lines`,
            badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        },
    ];

    return (
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 box-border">
            {kpis.map((kpi, idx) => (
                <div
                    key={idx}
                    className="bg-card text-card-foreground rounded-2xl px-4 py-3 border border-border shadow-sm flex items-center justify-between h-full transition-all duration-200 hover:shadow-md hover:border-[#D4A43C]/40 box-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                            {kpi.icon}
                        </div>
                        <div>
                            <p className="text-[11px] text-muted-foreground font-medium leading-none">{kpi.label}</p>
                            <p className="text-lg font-bold tracking-tight text-foreground mt-1 leading-none">{kpi.value}</p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${kpi.badgeColor}`}>
                        {kpi.badge}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// 6. Bento Grid: Recent Acquisitions Table (h: 3, 320px snug height)
// ============================================================================

interface LiveOrder {
    id: string;
    code: string;
    state: string;
    orderPlacedAt?: string;
    totalWithTax: number;
    currencyCode: string;
    customer?: {
        firstName?: string;
        lastName?: string;
    };
}

export function VakaaRecentOrdersWidget() {
    const [orders, setOrders] = React.useState<LiveOrder[]>([]);
    const [channelCurrency, setChannelCurrency] = React.useState('XAF');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        adminApiQuery<{
            activeChannel?: { defaultCurrencyCode: string };
            orders: {
                totalItems: number;
                items: LiveOrder[];
            };
        }>(`
            query GetRecentBoutiqueOrders {
                activeChannel {
                    defaultCurrencyCode
                }
                orders(options: { take: 6, sort: { createdAt: DESC } }) {
                    totalItems
                    items {
                        id
                        code
                        state
                        orderPlacedAt
                        totalWithTax
                        currencyCode
                        customer {
                            firstName
                            lastName
                        }
                    }
                }
            }
        `)
            .then((res) => {
                if (!isMounted) return;
                if (res.activeChannel?.defaultCurrencyCode) {
                    setChannelCurrency(res.activeChannel.defaultCurrencyCode);
                }
                setOrders(res.orders?.items || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('[VAKAA Recent Orders] Failed to fetch:', err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const getStatusBadge = (state: string) => {
        switch (state) {
            case 'PaymentAuthorized':
            case 'PaymentSettled':
                return { label: 'Settled', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
            case 'Shipped':
            case 'Delivered':
                return { label: state, color: 'bg-[#D4A43C]/15 text-[#D4A43C]' };
            case 'AddingItems':
            case 'ArrangingPayment':
                return { label: 'In Progress', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
            case 'Cancelled':
                return { label: 'Cancelled', color: 'bg-rose-500/10 text-rose-600' };
            default:
                return { label: state, color: 'bg-secondary text-foreground' };
        }
    };

    return (
        <div className="w-full h-full bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-sm flex flex-col justify-between overflow-hidden box-border">
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Recent Client Acquisitions</h3>
                    <p className="text-[11px] text-muted-foreground">Live customer orders across sales channels</p>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/80 text-[11px] font-medium text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A43C]" />
                    <span>{orders.length} {orders.length === 1 ? 'Acquisition' : 'Acquisitions'}</span>
                </div>
            </div>

            {loading ? (
                <div className="w-full flex-1 vakaa-skeleton flex items-center justify-center text-xs text-muted-foreground min-h-[120px]">
                    Loading live orders...
                </div>
            ) : orders.length === 0 ? (
                <div className="w-full flex-1 flex flex-col items-center justify-center text-center py-4">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground mb-1.5">
                        <svg className="w-5 h-5 text-[#D4A43C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-foreground">Awaiting First Boutique Acquisition</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                        Your flagship storefront is open and ready. When clientele make acquisitions, they will display here instantly.
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-border text-muted-foreground font-semibold">
                                <th className="pb-2 font-medium">Order Reference</th>
                                <th className="pb-2 font-medium">Client</th>
                                <th className="pb-2 font-medium">Placed At</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {orders.map((o) => {
                                const badge = getStatusBadge(o.state);
                                const clientName = [o.customer?.firstName, o.customer?.lastName].filter(Boolean).join(' ') || 'Boutique Client';
                                return (
                                    <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                                        <td className="py-2.5 font-mono font-semibold text-[#D4A43C]">
                                            {o.code}
                                        </td>
                                        <td className="py-2.5 font-medium text-foreground">
                                            {clientName}
                                        </td>
                                        <td className="py-2.5 text-muted-foreground">
                                            {formatOrderDate(o.orderPlacedAt)}
                                        </td>
                                        <td className="py-2.5">
                                            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${badge.color}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="py-2.5 font-bold text-foreground text-right">
                                            {formatCurrency(o.totalWithTax, o.currencyCode || channelCurrency)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// 7. Registration via defineDashboardExtension
// ============================================================================

defineDashboardExtension({
    login: {
        logo: {
            component: VakaaLoginLogo,
        },
        beforeForm: {
            component: VakaaLoginHeader,
        },
    },
    widgets: [
        {
            id: 'vakaa-hero-greeting',
            name: 'Boutique Greeting Banner',
            component: VakaaHeroGreetingWidget,
            defaultSize: { w: 12, h: 1, x: 0, y: 0 },
            minSize: { w: 6, h: 1 },
        },
        {
            id: 'vakaa-sales-analytics',
            name: 'Boutique Sales & Velocity',
            component: VakaaSalesAnalyticsWidget,
            defaultSize: { w: 8, h: 3, x: 0, y: 1 },
            minSize: { w: 6, h: 3 },
        },
        {
            id: 'vakaa-spotlight-products',
            name: 'Boutique Spotlight',
            component: VakaaSpotlightWidget,
            defaultSize: { w: 4, h: 3, x: 8, y: 1 },
            minSize: { w: 3, h: 3 },
        },
        {
            id: 'vakaa-kpi-row',
            name: 'Boutique KPI Metric Row',
            component: VakaaKpiRowWidget,
            defaultSize: { w: 12, h: 1, x: 0, y: 4 },
            minSize: { w: 6, h: 1 },
        },
        {
            id: 'vakaa-recent-orders',
            name: 'Recent Client Acquisitions',
            component: VakaaRecentOrdersWidget,
            defaultSize: { w: 12, h: 3, x: 0, y: 5 },
            minSize: { w: 6, h: 3 },
        },
    ],
});
