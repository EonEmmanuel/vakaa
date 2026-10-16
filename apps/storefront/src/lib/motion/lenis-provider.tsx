'use client';

import { createContext, useContext, useEffect, useRef, useState, Suspense, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
    return useContext(LenisContext);
}

function LenisRouteWatcher({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
    const pathname = usePathname();

    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenisRef]);

    return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
    const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Honor user motion preferences
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.4,
            infinite: false,
            autoRaf: false,
        });

        lenisRef.current = lenis;
        setLenisInstance(lenis);

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
            setLenisInstance(null);
        };
    }, []);

    return (
        <LenisContext.Provider value={lenisInstance}>
            <Suspense fallback={null}>
                <LenisRouteWatcher lenisRef={lenisRef} />
            </Suspense>
            {children}
        </LenisContext.Provider>
    );
}
