import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';

function InstagramIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

export async function InstagramFeed() {
    const images = [
        '/images/bags/baguette-indigo-savane-1.jpg',
        '/images/bags/maa-tote.jpg',
        '/images/bags/zuri-clutch.jpg',
        '/images/bags/kemi-shoulder.jpg',
        '/images/bags/baguette-terre-emeraude-1.jpg',
    ];

    return (
        <section className="py-24 sm:py-32 bg-[#FAF8F5]">
            <div className="vakaa-container mb-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#1D120A]">
                        @vakaaofficial
                    </h2>
                    <Link
                        href="https://instagram.com"
                        target="_blank"
                        className="text-xs font-bold uppercase tracking-widest text-[#A66B2D] hover:text-[#1D120A] transition-colors"
                    >
                        Suivre
                    </Link>
                </div>
            </div>

            {/* Bleeding Grid */}
            <div className="w-full">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-1">
                    {images.map((src, idx) => (
                        <a
                            key={idx}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden bg-[#E7DED0] block"
                        >
                            <Image
                                src={src}
                                alt="Instagram post"
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 1024px) 50vw, 20vw"
                            />
                            <div className="absolute inset-0 bg-[#1D120A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center">
                                <InstagramIcon className="w-8 h-8 text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
