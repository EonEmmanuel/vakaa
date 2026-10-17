'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    type ReactNode,
} from 'react';
import {
    adjustQuantity,
    removeFromCart as removeCartAction,
    clearCart as clearCartAction,
    getCartSnapshot,
    applyPromotionCode,
    removePromotionCode,
} from '../routes/actions';
import { addToCart, addProductToCartBySlug } from '@/features/products/add-to-cart';

export type CartLine = {
    id: string;
    quantity: number;
    unitPriceWithTax: number;
    linePriceWithTax: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        product: {
            id?: string;
            name: string;
            slug: string;
            featuredAsset?: {
                id?: string;
                preview: string;
            } | null;
        };
    };
};

export type CartOrder = {
    id?: string;
    currencyCode: string;
    totalQuantity: number;
    subTotalWithTax: number;
    shippingWithTax: number;
    totalWithTax: number;
    couponCodes?: string[] | null;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
    lines: CartLine[];
};

export const EMPTY_CART: CartOrder = {
    currencyCode: 'XAF',
    totalQuantity: 0,
    subTotalWithTax: 0,
    shippingWithTax: 0,
    totalWithTax: 0,
    lines: [],
};

export interface AddItemParams {
    variantId?: string;
    slug?: string;
    name: string;
    priceWithTax?: number;
    price?: number;
    assetPreview?: string;
    imageUrl?: string;
    sku?: string;
    quantity?: number;
    openDrawer?: boolean;
}

interface CartContextType {
    order: CartOrder | null;
    totalQuantity: number;
    isInitialized: boolean;
    error: string | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    initCart: (initialOrder: CartOrder | null) => void;
    initCount: (count: number) => void;
    addItem: (params: AddItemParams) => Promise<void>;
    updateQuantity: (lineId: string, quantity: number) => void;
    removeItem: (lineId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    clearError: () => void;
    applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
    removeCoupon: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'vakaa_cart_snapshot_v1';

function saveToStorage(cart: CartOrder | null) {
    if (typeof window === 'undefined') return;
    try {
        if (!cart || !cart.lines || cart.lines.length === 0) {
            sessionStorage.removeItem(STORAGE_KEY);
        } else {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }
    } catch {}
}

function loadFromStorage(): CartOrder | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && Array.isArray(parsed.lines) && parsed.lines.length > 0) {
                return parsed;
            }
        }
    } catch {}
    return null;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [order, setOrder] = useState<CartOrder | null>(null);
    const [initialCount, setInitialCount] = useState<number>(0);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Derive totalQuantity directly from order lines / totalQuantity
    const totalQuantity = order
        ? (order.totalQuantity ?? order.lines.reduce((acc, l) => acc + l.quantity, 0))
        : initialCount;

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    // Per-line debounce timers for rapid quantity adjustments
    const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
    const operationVersionRef = useRef<Record<string, number>>({});

    // FIFO Promise queue to serialize all server mutations and eliminate race conditions
    const mutationQueueRef = useRef<Promise<unknown>>(Promise.resolve());
    // Active optimistic lines awaiting server resolution
    const inFlightTempLinesRef = useRef<Map<string, CartLine>>(new Map());
    // Active modifiers on in-flight optimistic lines (e.g. removed or updated before server add resolved)
    type TempLineModifier = {
        removed?: boolean;
        quantity?: number;
        variantId?: string;
        slug?: string;
    };
    const pendingTempModifiersRef = useRef<Map<string, TempLineModifier>>(new Map());

    const enqueueCartMutation = useCallback(<T,>(mutationFn: () => Promise<T>): Promise<T> => {
        const nextPromise = mutationQueueRef.current.then(mutationFn, mutationFn);
        mutationQueueRef.current = nextPromise.catch(() => {});
        return nextPromise;
    }, []);

    // Hydrate cart from client storage immediately on mount
    useEffect(() => {
        const cached = loadFromStorage();
        if (cached) {
            setOrder((curr) => curr ?? cached);
            setIsInitialized(true);
        }
    }, []);

    const reconcileCart = useCallback(async () => {
        const snapshot = await getCartSnapshot();
        if (!snapshot.success) {
            setError('sync-failed');
            return;
        }

        const latestOrder = snapshot.order;
        if (latestOrder && latestOrder.lines.length > 0) {
            setOrder(latestOrder);
            saveToStorage(latestOrder);
        } else if (inFlightTempLinesRef.current.size === 0) {
            setOrder(EMPTY_CART);
            saveToStorage(null);
        }
        setError(null);
    }, []);

    const applyCanonicalOrder = useCallback((serverOrder: CartOrder | null) => {
        setOrder(() => {
            if (!serverOrder) {
                if (inFlightTempLinesRef.current.size > 0) {
                    const pendingLines = Array.from(inFlightTempLinesRef.current.values());
                    const totalQty = pendingLines.reduce((acc, l) => acc + l.quantity, 0);
                    const subTotal = pendingLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
                    const pendingOrder: CartOrder = {
                        ...EMPTY_CART,
                        lines: pendingLines,
                        totalQuantity: totalQty,
                        subTotalWithTax: subTotal,
                        totalWithTax: subTotal,
                    };
                    saveToStorage(pendingOrder);
                    return pendingOrder;
                }
                saveToStorage(null);
                return EMPTY_CART;
            }

            // Merge server lines with any still-pending optimistic lines.
            // Clone server lines to avoid mutating the original input.
            const mergedLines = serverOrder.lines.map((l) => ({ ...l }));
            const pendingLines = Array.from(inFlightTempLinesRef.current.values());

            for (const tempLine of pendingLines) {
                const existingIndex = mergedLines.findIndex(
                    (l) => (tempLine.productVariant.id && l.productVariant.id === tempLine.productVariant.id) ||
                           (tempLine.productVariant.product.slug && l.productVariant.product.slug === tempLine.productVariant.product.slug)
                );
                if (existingIndex > -1) {
                    const existing = mergedLines[existingIndex];
                    const nextQty = existing.quantity + tempLine.quantity;
                    mergedLines[existingIndex] = {
                        ...existing,
                        quantity: nextQty,
                        linePriceWithTax: nextQty * existing.unitPriceWithTax,
                    };
                } else {
                    mergedLines.push({ ...tempLine });
                }
            }

            const totalQty = mergedLines.reduce((acc, l) => acc + l.quantity, 0);
            const subTotal = mergedLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
            const discountTotal = (serverOrder.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
            const totalWithTax = Math.max(0, subTotal + (serverOrder.shippingWithTax || 0) - discountTotal);

            const reconciled: CartOrder = {
                ...serverOrder,
                lines: mergedLines,
                totalQuantity: totalQty,
                subTotalWithTax: subTotal,
                totalWithTax,
            };

            saveToStorage(reconciled.lines.length > 0 ? reconciled : null);
            return reconciled;
        });
    }, []);

    const cancelPendingLineUpdate = useCallback((lineId: string) => {
        const timer = debounceTimersRef.current[lineId];
        if (timer) {
            clearTimeout(timer);
            delete debounceTimersRef.current[lineId];
        }
        operationVersionRef.current[lineId] = (operationVersionRef.current[lineId] || 0) + 1;
        return operationVersionRef.current[lineId];
    }, []);

    const initCart = useCallback((initialOrder: CartOrder | null) => {
        setError(null);
        if (initialOrder && initialOrder.lines && initialOrder.lines.length > 0) {
            if (inFlightTempLinesRef.current.size === 0) {
                setOrder(initialOrder);
                saveToStorage(initialOrder);
            } else {
                applyCanonicalOrder(initialOrder);
            }
            setIsInitialized(true);
        } else {
            // Server returned empty/null order: protect against wiping in-memory optimistic or stored cart
            const stored = loadFromStorage();
            setOrder((current) => {
                const active = current || stored;
                if (active && active.lines && active.lines.length > 0) {
                    return active;
                }
                saveToStorage(null);
                return EMPTY_CART;
            });
            if (stored && stored.lines.length > 0) {
                void reconcileCart();
            }
            setIsInitialized(true);
        }
    }, [applyCanonicalOrder, reconcileCart]);

    const initCount = useCallback((count: number) => {
        setInitialCount((curr) => (curr > 0 ? curr : count));
        setIsInitialized(true);
    }, []);

    const removeItem = useCallback(async (lineId: string) => {
        setError(null);
        const operationVersion = cancelPendingLineUpdate(lineId);

        if (lineId.startsWith('temp-')) {
            // Track removal in pending modifier for in-flight server add
            const modifier = pendingTempModifiersRef.current.get(lineId);
            if (modifier) {
                modifier.removed = true;
            }
            inFlightTempLinesRef.current.delete(lineId);

            // Optimistic 0ms removal
            setOrder((prev) => {
                if (!prev) return EMPTY_CART;
                const nextLines = prev.lines.filter((l) => l.id !== lineId);
                const nextTotalQty = nextLines.reduce((acc, l) => acc + l.quantity, 0);
                const nextSubTotal = nextLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
                const discountTotal = (prev.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
                const nextTotal = Math.max(0, nextSubTotal + (prev.shippingWithTax || 0) - discountTotal);

                const updated: CartOrder = {
                    ...prev,
                    lines: nextLines,
                    totalQuantity: nextTotalQty,
                    subTotalWithTax: nextSubTotal,
                    totalWithTax: nextTotal,
                };
                saveToStorage(nextLines.length > 0 ? updated : null);
                return updated;
            });
            return;
        }

        // 1. Optimistic 0ms removal for real server line
        setOrder((prev) => {
            if (!prev) return EMPTY_CART;
            const nextLines = prev.lines.filter((l) => l.id !== lineId);
            const nextTotalQty = nextLines.reduce((acc, l) => acc + l.quantity, 0);
            const nextSubTotal = nextLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
            const discountTotal = (prev.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
            const nextTotal = Math.max(0, nextSubTotal + (prev.shippingWithTax || 0) - discountTotal);

            const updated: CartOrder = {
                ...prev,
                lines: nextLines,
                totalQuantity: nextTotalQty,
                subTotalWithTax: nextSubTotal,
                totalWithTax: nextTotal,
            };
            saveToStorage(nextLines.length > 0 ? updated : null);
            return updated;
        });

        // 2. Serialized background sync
        try {
            await enqueueCartMutation(async () => {
                const result = await removeCartAction(lineId);
                if (result.success && result.order) {
                    if (operationVersionRef.current[lineId] === operationVersion) {
                        applyCanonicalOrder(result.order);
                    }
                } else if (!result.success && operationVersionRef.current[lineId] === operationVersion) {
                    await reconcileCart();
                }
                return result;
            });
        } catch {
            await reconcileCart();
        }
    }, [applyCanonicalOrder, cancelPendingLineUpdate, enqueueCartMutation, reconcileCart]);

    const updateQuantity = useCallback((lineId: string, newQty: number) => {
        setError(null);
        const operationVersion = cancelPendingLineUpdate(lineId);

        if (newQty <= 0) {
            void removeItem(lineId);
            return;
        }

        if (lineId.startsWith('temp-')) {
            const modifier = pendingTempModifiersRef.current.get(lineId);
            if (modifier) {
                modifier.quantity = newQty;
            }
            const inFlightLine = inFlightTempLinesRef.current.get(lineId);
            if (inFlightLine) {
                inFlightLine.quantity = newQty;
                inFlightLine.linePriceWithTax = newQty * inFlightLine.unitPriceWithTax;
            }

            // 1. Optimistic 0ms in-memory update
            setOrder((prev) => {
                if (!prev) return null;
                const nextLines = prev.lines.map((line) => {
                    if (line.id === lineId) {
                        return {
                            ...line,
                            quantity: newQty,
                            linePriceWithTax: newQty * line.unitPriceWithTax,
                        };
                    }
                    return line;
                });

                const nextTotalQty = nextLines.reduce((acc, l) => acc + l.quantity, 0);
                const nextSubTotal = nextLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
                const discountTotal = (prev.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
                const nextTotal = Math.max(0, nextSubTotal + (prev.shippingWithTax || 0) - discountTotal);

                const updated: CartOrder = {
                    ...prev,
                    lines: nextLines,
                    totalQuantity: nextTotalQty,
                    subTotalWithTax: nextSubTotal,
                    totalWithTax: nextTotal,
                };
                saveToStorage(updated);
                return updated;
            });
            return;
        }

        // 1. Optimistic 0ms in-memory update: recalculate line price, subtotal, and order total
        setOrder((prev) => {
            if (!prev) return null;
            const nextLines = prev.lines.map((line) => {
                if (line.id === lineId) {
                    return {
                        ...line,
                        quantity: newQty,
                        linePriceWithTax: newQty * line.unitPriceWithTax,
                    };
                }
                return line;
            });

            const nextTotalQty = nextLines.reduce((acc, l) => acc + l.quantity, 0);
            const nextSubTotal = nextLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
            const discountTotal = (prev.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
            const nextTotal = Math.max(0, nextSubTotal + (prev.shippingWithTax || 0) - discountTotal);

            const updated: CartOrder = {
                ...prev,
                lines: nextLines,
                totalQuantity: nextTotalQty,
                subTotalWithTax: nextSubTotal,
                totalWithTax: nextTotal,
            };
            saveToStorage(updated);
            return updated;
        });

        // 2. Debounce network mutation to avoid flooding server on rapid clicks, queued via FIFO mutex
        debounceTimersRef.current[lineId] = setTimeout(async () => {
            await enqueueCartMutation(async () => {
                const result = await adjustQuantity(lineId, newQty);
                if (result.success && result.order) {
                    if (operationVersionRef.current[lineId] === operationVersion) {
                        applyCanonicalOrder(result.order);
                    }
                } else if (!result.success && operationVersionRef.current[lineId] === operationVersion) {
                    await reconcileCart();
                }
                return result;
            });
        }, 300);
    }, [applyCanonicalOrder, cancelPendingLineUpdate, enqueueCartMutation, reconcileCart, removeItem]);

    const clearCart = useCallback(async () => {
        setError(null);
        Object.keys(debounceTimersRef.current).forEach(cancelPendingLineUpdate);
        inFlightTempLinesRef.current.clear();
        pendingTempModifiersRef.current.clear();

        // 1. Optimistic 0ms clear: set EMPTY_CART explicitly (never null) so UI renders empty state instantly
        setOrder(EMPTY_CART);
        saveToStorage(null);

        // 2. Serialized background sync
        try {
            await enqueueCartMutation(async () => {
                const result = await clearCartAction();
                if (result.success && result.order) {
                    applyCanonicalOrder(result.order);
                } else if (!result.success) {
                    await reconcileCart();
                }
                return result;
            });
        } catch {
            await reconcileCart();
        }
    }, [applyCanonicalOrder, cancelPendingLineUpdate, enqueueCartMutation, reconcileCart]);

    const addItem = useCallback(async (params: AddItemParams) => {
        const qtyToAdd = params.quantity || 1;
        const unitPrice = params.priceWithTax ?? params.price ?? 0;
        const assetPreview = params.assetPreview ?? params.imageUrl;
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const newLine: CartLine = {
            id: tempId,
            quantity: qtyToAdd,
            unitPriceWithTax: unitPrice,
            linePriceWithTax: unitPrice * qtyToAdd,
            productVariant: {
                id: params.variantId || '',
                name: params.name,
                sku: params.sku || '',
                product: {
                    name: params.name,
                    slug: params.slug || '',
                    featuredAsset: assetPreview ? { preview: assetPreview } : null,
                },
            },
        };

        // Track in-flight optimistic line so server responses don't wipe out subsequent quick additions
        inFlightTempLinesRef.current.set(tempId, newLine);
        pendingTempModifiersRef.current.set(tempId, {
            variantId: params.variantId,
            slug: params.slug,
        });

        setIsInitialized(true);
        if (params.openDrawer) {
            setIsOpen(true);
        }

        // 1. Optimistic 0ms in-memory order creation / update
        setOrder((prev) => {
            const current = (prev && prev.lines.length > 0) ? prev : loadFromStorage();

            if (!current || current.lines.length === 0) {
                // Initialize new optimistic cart immediately
                const newOrder: CartOrder = {
                    currencyCode: 'XAF',
                    totalQuantity: qtyToAdd,
                    subTotalWithTax: unitPrice * qtyToAdd,
                    shippingWithTax: 0,
                    totalWithTax: unitPrice * qtyToAdd,
                    lines: [newLine],
                };
                saveToStorage(newOrder);
                return newOrder;
            }

            const existingIndex = current.lines.findIndex(
                (l) => (params.variantId && l.productVariant.id === params.variantId) ||
                       (params.slug && l.productVariant.product.slug === params.slug)
            );

            let nextLines = [...current.lines];
            if (existingIndex > -1) {
                const existing = nextLines[existingIndex];
                const updatedQty = existing.quantity + qtyToAdd;
                nextLines[existingIndex] = {
                    ...existing,
                    quantity: updatedQty,
                    linePriceWithTax: updatedQty * existing.unitPriceWithTax,
                };
            } else {
                nextLines = [newLine, ...nextLines];
            }

            const nextTotalQty = nextLines.reduce((acc, l) => acc + l.quantity, 0);
            const nextSubTotal = nextLines.reduce((acc, l) => acc + l.linePriceWithTax, 0);
            const discountTotal = (current.discounts || []).reduce((acc, d) => acc + d.amountWithTax, 0);
            const nextTotal = Math.max(0, nextSubTotal + (current.shippingWithTax || 0) - discountTotal);

            const updated: CartOrder = {
                ...current,
                lines: nextLines,
                totalQuantity: nextTotalQty,
                subTotalWithTax: nextSubTotal,
                totalWithTax: nextTotal,
            };
            saveToStorage(updated);
            return updated;
        });

        // 2. Serialized background server mutation via FIFO queue
        try {
            await enqueueCartMutation(async () => {
                const addPromise = params.variantId
                    ? addToCart(params.variantId, qtyToAdd)
                    : addProductToCartBySlug(params.slug || '', qtyToAdd);

                let result = await addPromise;
                if (!result.success) {
                    // Fallback to slug if variant failed
                    if (params.variantId && params.slug) {
                        const fallbackResult = await addProductToCartBySlug(params.slug, qtyToAdd);
                        if (fallbackResult.success && fallbackResult.order) {
                            result = fallbackResult;
                        }
                    }
                }

                const modifier = pendingTempModifiersRef.current.get(tempId);
                pendingTempModifiersRef.current.delete(tempId);
                inFlightTempLinesRef.current.delete(tempId);

                if (!result.success) {
                    throw new Error(result.error);
                }

                // Intelligently merge server canonical order with any remaining in-flight additions
                if (result.order) {
                    let canonical = result.order as unknown as CartOrder;
                    const serverLine = canonical.lines.find(
                        (l) => (modifier?.variantId && l.productVariant.id === modifier.variantId) ||
                               (modifier?.slug && l.productVariant.product.slug === modifier.slug)
                    );

                    if (modifier?.removed && serverLine) {
                        // User removed item before server add resolved:
                        // 1. Exclude from canonical state so it stays removed
                        canonical = {
                            ...canonical,
                            lines: canonical.lines.filter((l) => l.id !== serverLine.id),
                        };
                        applyCanonicalOrder(canonical);

                        // 2. Immediately enqueue removal of the created line on the server
                        void enqueueCartMutation(async () => {
                            const removeRes = await removeCartAction(serverLine.id);
                            if (removeRes.success && removeRes.order) {
                                applyCanonicalOrder(removeRes.order as unknown as CartOrder);
                            }
                            return removeRes;
                        });
                    } else if (modifier?.quantity && serverLine && modifier.quantity !== serverLine.quantity) {
                        // User adjusted quantity before server add resolved:
                        const targetQty = modifier.quantity;
                        canonical = {
                            ...canonical,
                            lines: canonical.lines.map((l) => l.id === serverLine.id ? {
                                ...l,
                                quantity: targetQty,
                                linePriceWithTax: targetQty * l.unitPriceWithTax,
                            } : l),
                        };
                        applyCanonicalOrder(canonical);

                        // Enqueue adjustment of the line on the server
                        void enqueueCartMutation(async () => {
                            const adjustRes = await adjustQuantity(serverLine.id, targetQty);
                            if (adjustRes.success && adjustRes.order) {
                                applyCanonicalOrder(adjustRes.order as unknown as CartOrder);
                            }
                            return adjustRes;
                        });
                    } else {
                        applyCanonicalOrder(canonical);
                    }
                }
                return result;
            });
        } catch (err) {
            pendingTempModifiersRef.current.delete(tempId);
            inFlightTempLinesRef.current.delete(tempId);
            void reconcileCart();
            throw err;
        }
    }, [applyCanonicalOrder, enqueueCartMutation, reconcileCart]);

    const applyCoupon = useCallback(async (code: string) => {
        const fd = new FormData();
        fd.append('code', code);
        const result = await applyPromotionCode(undefined, fd);
        if (result.success) {
            await reconcileCart();
        }
        return result;
    }, [reconcileCart]);

    const removeCoupon = useCallback(async (code: string) => {
        const fd = new FormData();
        fd.append('code', code);
        await removePromotionCode(fd);
        await reconcileCart();
    }, [reconcileCart]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimersRef.current).forEach((t) => clearTimeout(t));
        };
    }, []);

    return (
        <CartContext.Provider
            value={{
                order,
                totalQuantity,
                isInitialized,
                error,
                isOpen,
                setIsOpen,
                openCart,
                closeCart,
                toggleCart,
                initCart,
                initCount,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
                clearError: () => setError(null),
                applyCoupon,
                removeCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
