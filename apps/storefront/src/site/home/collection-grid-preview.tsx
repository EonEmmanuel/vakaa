'use client';

import Image from 'next/image';
import { Link } from '@/platform/i18n/navigation';
import { motion } from 'framer-motion';

export function CollectionGridPreview() {
    const categories = [
        {
            title: 'Sacs Cabas',
            image: '/images/cat-tote.jpg',
            href: '/search?category=tote-bags',
            spanClass: 'col-span-2 lg:col-span-2 lg:row-span-2',
            aspect: 'aspect-[4/3] lg:aspect-auto lg:h-full'
        },
        {
            title: 'Porté Épaule',
            image: '/images/cat-shoulder.jpg',
            href: '/search?category=shoulder-bags',
            spanClass: 'col-span-1',
            aspect: 'aspect-square'
        },
        {
            title: 'Bandoulière',
            image: '/images/cat-crossbody.jpg',
            href: '/search?category=crossbody',
            spanClass: 'col-span-1',
            aspect: 'aspect-square'
        },
        {
            title: 'Pochettes',
            image: '/images/cat-clutch.jpg',
            href: '/search?category=clutches',
            spanClass: 'col-span-1',
            aspect: 'aspect-square'
        },
        {
            title: 'Petite Maroquinerie',
            image: '/images/cat-accessory.jpg',
            href: '/search?category=accessories',
            spanClass: 'col-span-1',
            aspect: 'aspect-square'
        }
    ];

    return (
        <section className="py-24 sm:py-32 bg-[#FAF8F5]">
            <div className="vakaa-container space-y-16">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                >
                    <div className="space-y-4">
                        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#A66B2D]">
                            03 Lignes
                        </span>
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-[#1D120A] uppercase leading-none">
                            Les Volumes
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: idx * 0.1 }}
                            className={`group relative overflow-hidden bg-[#EFE8DD] ${cat.spanClass}`}
                        >
                            <Link href={cat.href} className={`block w-full ${cat.aspect}`}>
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2">
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                                        {cat.title}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
