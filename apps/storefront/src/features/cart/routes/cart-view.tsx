'use client';

import { useEffect } from 'react';
import { useCart, type CartOrder, EMPTY_CART } from '../context/cart-context';
import { CartItems } from './cart-items';
import { OrderSummary } from './order-summary';

export function CartView({ initialOrder }: { initialOrder: CartOrder | null }) {
    const { initCart, order, isInitialized } = useCart();

    useEffect(() => {
        if (!isInitialized) {
            initCart(initialOrder);
        }
    }, [initialOrder, initCart, isInitialized]);

    const activeOrder = isInitialized ? (order || EMPTY_CART) : (order || initialOrder || EMPTY_CART);

    if (!activeOrder || activeOrder.lines.length === 0) {
        return <CartItems activeOrder={EMPTY_CART} />;
    }

    return (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8">
                <CartItems activeOrder={activeOrder} />
            </div>

            <div className="lg:col-span-4">
                <OrderSummary activeOrder={activeOrder} />
            </div>
        </div>
    );
}
