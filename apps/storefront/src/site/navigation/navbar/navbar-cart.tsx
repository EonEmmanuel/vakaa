import {CartIcon} from './cart-icon';
import {query} from '@/platform/vendure/api';
import {GetActiveOrderQuery} from '@/features/cart/graphql';

export const dynamic = 'force-dynamic';

export async function NavbarCart() {
    let cartItemCount = 0;
    try {
        const orderResult = await query(GetActiveOrderQuery, undefined, {
            useAuthToken: true,
            tags: ['cart'],
        });
        cartItemCount = orderResult.data?.activeOrder?.totalQuantity || 0;
    } catch {
        cartItemCount = 0;
    }

    return <CartIcon cartItemCount={cartItemCount} />;
}
