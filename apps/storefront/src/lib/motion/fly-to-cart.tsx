'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/platform/i18n/navigation';

interface FlyEvent {
    id: string;
    sourceRect: DOMRect;
    imageSrc: string;
    productName: string;
}

interface FlyToCartContextType {
    triggerFly: (sourceRect: DOMRect, imageSrc: string, productName: string) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export function useFlyToCart() {
    const context = useContext(FlyToCartContext);
    if (!context) {
        throw new Error('useFlyToCart must be used within a FlyToCartProvider');
    }
    return context;
}

export function FlyToCartProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<FlyEvent[]>([]);
    
    const triggerFly = useCallback((sourceRect: DOMRect, imageSrc: string, productName: string) => {
        const id = Math.random().toString(36).substring(7);
        setEvents(prev => [...prev, { id, sourceRect, imageSrc, productName }]);
    }, []);

    const removeEvent = useCallback((id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    }, []);

    return (
        <FlyToCartContext.Provider value={{ triggerFly }}>
            {children}
            <FlyToCartPortal events={events} onComplete={removeEvent} />
        </FlyToCartContext.Provider>
    );
}

function FlyToCartPortal({ events, onComplete }: { events: FlyEvent[], onComplete: (id: string) => void }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || typeof window === 'undefined') return null;

    return createPortal(
        <div className="pointer-events-none fixed inset-0 z-[99999]">
            {events.map(event => (
                <FlyItem key={event.id} event={event} onComplete={() => onComplete(event.id)} />
            ))}
        </div>,
        document.body
    );
}

function FlyItem({ event, onComplete }: { event: FlyEvent, onComplete: () => void }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('Product');
    const router = useRouter();
    
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const inner = innerRef.current;
        if (!wrapper || !inner) return;
        
        const cartIcon = document.querySelector('[data-cart-icon]') || document.getElementById('vakaa-cart-icon');
        const handleComplete = () => {
            toast.success(t('addedToCart'), {
                description: event.productName,
                action: { label: t('viewCart'), onClick: () => router.push('/cart') }
            });
            onComplete();
        };

        if (!cartIcon) {
            handleComplete();
            return;
        }
        
        const cartRect = cartIcon.getBoundingClientRect();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            handleComplete();
            return;
        }
        
        // Exact initial viewport coordinates
        gsap.set(wrapper, {
            x: event.sourceRect.left,
            y: event.sourceRect.top,
            width: event.sourceRect.width,
            height: event.sourceRect.height,
            opacity: 1,
            zIndex: 99999,
        });
        
        gsap.set(inner, {
            scale: 1,
            opacity: 1,
            rotate: 0,
            boxShadow: '0 25px 45px -10px rgba(212, 164, 60, 0.35), 0 15px 25px -5px rgba(28, 27, 24, 0.25)',
        });

        // Refined timing: 1.15s allows the eye to follow the trajectory gracefully
        const flightDuration = 1.15;

        const targetX = cartRect.left + cartRect.width / 2 - event.sourceRect.width / 2;
        const targetY = cartRect.top + cartRect.height / 2 - event.sourceRect.height / 2;

        const xAnim = gsap.to(wrapper, {
            x: targetX,
            duration: flightDuration,
            ease: 'power2.inOut',
        });
        
        const yAnim = gsap.to(wrapper, {
            y: targetY,
            duration: flightDuration,
            ease: 'power2.in',
            onComplete: () => {
                // Cart Icon elastic bounce upon arrival
                gsap.fromTo(cartIcon,
                    { scale: 1 },
                    { scale: 1.4, duration: 0.45, ease: 'elastic.out(1.2, 0.35)', onComplete: () => {
                        gsap.to(cartIcon, { scale: 1, duration: 0.2 });
                    }}
                );
                
                // Badge pulse feedback
                const badge = document.getElementById('vakaa-cart-count-badge');
                if (badge) {
                    gsap.fromTo(badge,
                        { scale: 0.8 },
                        { scale: 1.5, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }
                    );
                }

                handleComplete();
            }
        });
        
        // Parabolic arc upward jump (gentle float before swoop)
        const arcAnim = gsap.to(inner, {
            y: -140,
            duration: flightDuration * 0.46,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
        });
        
        // Gentle aerodynamic tilt
        const rotAnim = gsap.to(inner, {
            rotate: -12,
            duration: flightDuration,
            ease: 'power1.out',
        });
        
        // Graceful scaling down into the shopping bag
        const scaleAnim = gsap.to(inner, {
            scale: 0.15,
            opacity: 0.9,
            duration: flightDuration,
            ease: 'power2.inOut',
        });
        
        return () => {
            xAnim.kill();
            yAnim.kill();
            arcAnim.kill();
            rotAnim.kill();
            scaleAnim.kill();
            gsap.killTweensOf(inner);
        };
    }, [event, onComplete, t, router]);

    return (
        <div
            ref={wrapperRef}
            className="fixed top-0 left-0 pointer-events-none rounded-2xl overflow-hidden z-[99999]"
            style={{
                width: event.sourceRect.width,
                height: event.sourceRect.height,
                transformOrigin: 'center center',
                willChange: 'transform',
            }}
        >
            <div
                ref={innerRef}
                className="w-full h-full rounded-2xl overflow-hidden bg-white/95 border-2 border-[#D4A43C] shadow-2xl relative"
            >
                {event.imageSrc ? (
                    <img 
                        src={event.imageSrc} 
                        alt={event.productName} 
                        className="w-full h-full object-cover object-center" 
                    />
                ) : (
                    <div className="w-full h-full bg-[#1c1b18] flex items-center justify-center text-[#D4A43C] font-serif text-lg font-bold">
                        V
                    </div>
                )}
            </div>
        </div>
    );
}
