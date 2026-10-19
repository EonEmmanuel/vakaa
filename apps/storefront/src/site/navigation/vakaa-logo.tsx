import Image from 'next/image';

interface VakaaLogoProps {
    className?: string;
    variant?: 'auto' | 'light' | 'dark' | 'gold';
    height?: number;
    /** Overrides the default height ladder (h-6 sm:h-7 md:h-8) on the rendered logo image(s). */
    imgClassName?: string;
}

export function VakaaLogo({ className = '', variant = 'auto', height = 28, imgClassName }: VakaaLogoProps) {
    const width = Math.round(height * 3.21);
    const sizeClasses = imgClassName ?? 'h-6 sm:h-7 md:h-8';

    if (variant === 'gold') {
        return (
            <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
                <Image
                    src="/images/vakaa-logo-gold.png"
                    alt="Vakáa"
                    width={width}
                    height={height}
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                    className={`${sizeClasses} w-auto object-contain`}
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
                    style={{ width: 'auto', height: 'auto' }}
                    className={`${sizeClasses} w-auto object-contain`}
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
                    style={{ width: 'auto', height: 'auto' }}
                    className={`${sizeClasses} w-auto object-contain`}
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
                style={{ width: 'auto', height: 'auto' }}
                className={`dark:hidden ${sizeClasses} w-auto object-contain`}
            />
            <Image
                src="/images/vakaa-logo-light.png"
                alt="Vakáa"
                width={width}
                height={height}
                priority
                style={{ width: 'auto', height: 'auto' }}
                className={`hidden dark:block ${sizeClasses} w-auto object-contain`}
            />
        </div>
    );
}
