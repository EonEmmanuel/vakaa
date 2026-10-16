import { getRouteLocale } from '@/platform/i18n/server';
import { Link } from '@/platform/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getTopCollections } from '@/features/collections/data';

export default async function NotFound() {
    const locale = await getRouteLocale();
    const t = await getTranslations({ locale, namespace: 'NotFound' });
    let collections: { id: string; name: string; slug: string }[] = [];
    try {
        collections = await getTopCollections(locale);
    } catch {
        // Gracefully handle
    }

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 bg-[#FAF8F5] text-[#1D120A]">
            <div className="text-center space-y-8 max-w-xl mx-auto">
                {/* 1. Large 404 with Masked Image Background */}
                <div className="relative select-none">
                    <span
                        className="text-[120px] sm:text-[180px] lg:text-[220px] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-cover bg-center drop-shadow-sm inline-block"
                        style={{
                            backgroundImage: `url('/images/cat-tote.jpg')`,
                            WebkitBackgroundClip: 'text',
                        }}
                    >
                        404
                    </span>
                </div>

                {/* 2. Headline & Subtitle */}
                <div className="space-y-3">
                    <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#1D120A]">
                        {t('title')}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#3A2418]/70 max-w-md mx-auto font-sans leading-relaxed">
                        {t('message')}
                    </p>
                </div>

                {/* 3. Primary CTA Button */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-[#1D120A] hover:bg-[#1D120A]/90 text-[#FAF8F5] px-9 py-4 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
                    >
                        {t('goHome')}
                    </Link>
                </div>

                {/* 4. Popular Collections Navigation */}
                {collections.length > 0 && (
                    <div className="pt-8 border-t border-[#E7DED0]/70 max-w-md mx-auto space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#A66B2D]">
                            {t('popularCollections')}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {collections.slice(0, 5).map((col) => (
                                <Link
                                    key={col.id}
                                    href={`/collection/${col.slug}`}
                                    className="px-4 py-2 rounded-full border border-[#E7DED0] bg-[#FAF8F5] text-xs font-semibold text-[#1D120A] hover:bg-[#F3EFE9] transition-colors"
                                >
                                    {col.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
