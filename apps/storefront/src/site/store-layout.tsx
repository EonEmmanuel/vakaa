import {Navbar} from '@/site/navigation/navbar';
import {Footer} from '@/site/footer';
import {CartProvider, CartDrawer} from '@/features/cart';

export default function StoreLayout({children}: {children: React.ReactNode}) {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen relative">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
