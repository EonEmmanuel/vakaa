import {getTranslations} from 'next-intl/server';
import {getRouteLocale} from '@/platform/i18n/server';
import {Mail, ShieldCheck, ArrowRight} from 'lucide-react';

export async function TribeNewsletter() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <section className="py-16 sm:py-24 bg-[#FAF8F5] transition-colors">
            <div className="vakaa-container max-w-3xl">
                <div className="relative rounded-3xl bg-[#F3EFE9] text-[#1D120A] p-8 sm:p-12 lg:p-14 shadow-xs text-center space-y-6">
                    {/* Header */}
                    <div className="space-y-2 max-w-xl mx-auto">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66B2D]">
                            Le Cercle Privé VAKÁA
                        </span>

                        <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1D120A] tracking-tight leading-tight">
                            Rejoignez Notre Cercle Confidentiel
                        </h2>

                        <p className="text-xs sm:text-sm text-[#3A2418]/70 font-sans leading-relaxed pt-1">
                            Recevez en avant-première nos capsules numérotées, lancements d&apos;ateliers et privilèges exclusifs.
                        </p>
                    </div>

                    {/* Form Container */}
                    <form
                        action="#"
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full pt-1"
                    >
                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder={t('newsletter.placeholder')}
                                required
                                className="h-12 px-5 pr-10 bg-white text-xs sm:text-sm text-[#1D120A] placeholder:text-[#3A2418]/45 border-0 shadow-xs focus:ring-2 focus:ring-[#A66B2D] focus:outline-hidden w-full rounded-full transition-all"
                            />
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A66B2D]/70 pointer-events-none" />
                        </div>

                        <button
                            type="submit"
                            className="h-12 bg-[#1D120A] hover:bg-[#3A2418] text-[#FAF8F5] font-semibold text-xs uppercase px-7 tracking-wider rounded-full shrink-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer w-full sm:w-auto hover:-translate-y-0.5 active:scale-[0.98] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <span>{t('newsletter.button')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    {/* Trust and Assurance Footnote */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-1 text-[11px] text-[#3A2418]/50 tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#A66B2D]" />
                            Données protégées & confidentielles
                        </span>
                        <span>•</span>
                        <span>Désabonnement en un clic</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
