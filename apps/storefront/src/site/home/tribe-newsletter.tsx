import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {Mail, Sparkles} from 'lucide-react';

export async function TribeNewsletter() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="relative overflow-hidden bg-[#120B06] text-[#FAF7F2] py-16 sm:py-20 lg:py-24 border-t border-[#3A291C]/60 transition-colors">
            {/* Subtle background ambient gold glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4A43C]/10 blur-[120px] pointer-events-none" />

            <div className="vakaa-container relative z-10 max-w-4xl mx-auto text-center space-y-8">
                {/* Header Badge & Title */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A43C]">
                        <Sparkles className="size-3 text-[#D4A43C]" />
                        <span>Le Cercle Privé VAKAA</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF7F2] uppercase leading-tight">
                        {t('newsletter.title')}
                    </h2>
                    <p className="text-sm sm:text-base text-[#FAF7F2]/75 max-w-lg mx-auto font-sans leading-relaxed">
                        {t('newsletter.description')}
                    </p>
                </div>

                {/* Subscription Form */}
                <form
                    action="#"
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full pt-2"
                >
                    <input
                        type="email"
                        placeholder={t('newsletter.placeholder')}
                        required
                        className="h-12 px-5 bg-[#1C120A] text-sm text-[#FAF7F2] placeholder:text-[#FAF7F2]/40 border border-[#3A291C] focus:border-[#D4A43C] focus:outline-hidden focus:ring-1 focus:ring-[#D4A43C] w-full rounded-xs transition-colors"
                    />
                    <button
                        type="submit"
                        className="h-12 bg-[#D4A43C] hover:bg-[#C29332] text-[#140C06] font-bold text-xs uppercase px-8 tracking-widest rounded-xs shrink-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-full sm:w-auto whitespace-nowrap"
                    >
                        {t('newsletter.button')}
                    </button>
                </form>

                {/* Assurance Note */}
                <p className="text-[11px] text-[#FAF7F2]/40 tracking-wider">
                    Accès prioritaire aux lancements d&apos;éditions limitées et invitations privées. Désabonnement en un clic.
                </p>
            </div>
        </section>
    );
}
