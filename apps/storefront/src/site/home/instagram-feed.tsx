import Image from 'next/image';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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

export function InstagramFeed() {
    const posts = [
        {
            src: '/images/bags/maa-tote.jpg',
            alt: 'Le Cabas Maa porté lors d’une escapade estivale',
            caption: 'Allure citadine et textures solaires.',
        },
        {
            src: '/images/bags/baguette-indigo-savane-1.jpg',
            alt: 'Sac baguette porté épaule finition laiton',
            caption: 'L’indigo profond marié au cuir savane.',
        },
        {
            src: '/images/artisan-hands.jpg',
            alt: 'Gestes minutieux de nos artisanes à Bolgatanga',
            caption: 'Patience et transmission.',
        },
        {
            src: '/images/bags/zuri-clutch.jpg',
            alt: 'Pochette Zuri lors d’un dîner de gala',
            caption: 'Élégance nocturne intemporelle.',
        },
        {
            src: '/images/bags/maa-tote.jpg',
            alt: 'Détail du tressage de raphia naturel',
            caption: 'Chaque brin de raphia raconte une histoire.',
        },
    ];

    return (
        <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#E7DED0]/60 transition-colors">
            <div className="vakaa-container space-y-8 sm:space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-2 max-w-xl mx-auto">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66B2D]">
                        @vakaaofficial
                    </span>
                    <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                        Rejoignez Notre Communauté sur Instagram
                    </h2>
                    <p className="text-xs sm:text-sm text-[#3A2418]/70 font-sans leading-relaxed pt-1">
                        Partagez vos créations avec le hashtag <span className="font-semibold text-[#1D120A]">#VakaaWomen</span>
                    </p>
                </div>

                {/* 5-Column Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {posts.map((post, idx) => (
                        <a
                            key={idx}
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={post.alt}
                            className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F3EFE9] shadow-xs cursor-pointer"
                        >
                            <Image
                                src={post.src}
                                alt={post.alt}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#1D120A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                                <div className="size-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <InstagramIcon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FAF8F5]/90 line-clamp-2">
                                    {post.caption}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}
