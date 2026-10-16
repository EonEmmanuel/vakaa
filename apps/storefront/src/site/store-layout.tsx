import {Navbar} from '@/site/navigation/navbar';
import {Footer} from '@/site/footer';
import {WhatsAppConcierge} from '@/components/whatsapp-concierge';
import {CartProvider} from '@/features/cart/context/cart-context';
import {CartDrawer} from '@/features/cart/components/cart-drawer';

export default function StoreLayout({children}: {children: React.ReactNode}) {
    return (
        <CartProvider>
            <div className="flex flex-col min-h-screen relative">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppConcierge />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
