import Image from 'next/image';

interface VakaaLogoProps {
    className?: string;
    variant?: 'auto' | 'light' | 'dark' | 'gold';
    height?: number;
}

export function VakaaLogo({ className = '', variant = 'auto', height = 28 }: VakaaLogoProps) {
    const width = Math.round(height * 3.21);

    if (variant === 'gold') {
        return (
            <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
                <Image
                    src="/images/vakaa-logo-gold.png"
                    alt="Vakáa"
                    width={width}
                    height={height}
                    priority
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                />
            </div>
        );
    }

    if (variant === 'light') {
        return (
            <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
                <Image
                    src="/images/vakaa-logo-light.png"
                    alt="Vakáa"
                    width={width}
                    height={height}
                    priority
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                />
            </div>
        );
    }

    if (variant === 'dark') {
        return (
            <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
                <Image
                    src="/images/vakaa-logo-dark.png"
                    alt="Vakáa"
                    width={width}
                    height={height}
                    priority
                    className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                />
            </div>
        );
    }

    // Default 'auto': Responsive to system / theme light & dark modes
    return (
        <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
            <Image
                src="/images/vakaa-logo-dark.png"
                alt="Vakáa"
                width={width}
                height={height}
                priority
                className="dark:hidden h-6 sm:h-7 md:h-8 w-auto object-contain"
            />
            <Image
                src="/images/vakaa-logo-light.png"
                alt="Vakáa"
                width={width}
                height={height}
                priority
                className="hidden dark:block h-6 sm:h-7 md:h-8 w-auto object-contain"
            />
        </div>
    );
}
