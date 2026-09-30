import {Navbar} from '@/site/navigation/navbar';
import {Footer} from '@/site/footer';
import {WhatsAppConcierge} from '@/components/whatsapp-concierge';

export default function StoreLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col min-h-screen relative">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppConcierge />
        </div>
    );
}
