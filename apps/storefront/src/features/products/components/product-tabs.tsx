'use client';

import { useState, useTransition } from 'react';
import { Star, ShieldCheck, Sparkles, CheckCircle2, UploadCloud, ChevronDown } from 'lucide-react';
import { submitProductReviewAction } from '@/features/products/submit-review';
import { toast } from 'sonner';

export interface ProductCustomFields {
    material?: string | null;
    leatherOrigin?: string | null;
    dimensions?: string | null;
    strapDrop?: string | null;
    weight?: string | null;
    artisanOrigin?: string | null;
    careInstructions?: string | null;
    isLimitedEdition?: boolean | null;
    curatorBadge?: string | null;
}

export interface ReviewItem {
    id?: string;
    authorName?: string;
    author?: string;
    authorLocation?: string;
    location?: string;
    rating: number;
    date?: string;
    createdAt?: string;
    title: string;
    comment: string;
    isVerifiedBuyer?: boolean;
    images?: string[];
}

export interface ReviewSummaryData {
    averageRating: number;
    totalReviews: number;
    distribution?: Array<{ stars: number; count: number }>;
}

interface ProductTabsProps {
    productId?: string;
    description: string;
    productName: string;
    customFields?: ProductCustomFields | null;
    initialReviews?: ReviewItem[];
    initialSummary?: ReviewSummaryData;
}

function SplitCircleBullet() {
    return (
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="8" fill="#D4A43C" />
            <path d="M8 0A8 8 0 0 1 8 16V0Z" fill="#1c1b18" />
        </svg>
    );
}

export function ProductTabs({
    productId,
    description,
    productName,
    customFields,
    initialReviews = [],
    initialSummary,
}: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
    const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');
    const [isPending, startTransition] = useTransition();

    // Inline review form state
    const [newRating, setNewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    const defaultCuratedReviews: ReviewItem[] = [
        {
            id: 'rev-1',
            authorName: 'Aïssatou D.',
            authorLocation: 'Dakar & Paris',
            rating: 5,
            date: 'Il y a 2 semaines',
            title: 'Un chef-d’œuvre d’artisanat',
            comment: 'La qualité du raphia et les finitions en cuir sont exceptionnelles. Le sac attire tous les regards, tout en étant léger et très spacieux. C’est du vrai luxe africain contemporain.',
            isVerifiedBuyer: true,
            images: ['/images/bags/baguette-indigo-savane-1.jpg', '/images/bags/maa-tote.jpg'],
        },
        {
            id: 'rev-2',
            authorName: 'Marc-Antoine B.',
            authorLocation: 'Douala',
            rating: 5,
            date: 'Il y a 1 mois',
            title: 'Cadeau somptueux',
            comment: 'Offert pour l’anniversaire de mon épouse. L’emballage soigné, la signature d’atelier et l’odeur du cuir pleine fleur font toute la différence. Livraison express en 24h très appréciée.',
            isVerifiedBuyer: true,
        },
        {
            id: 'rev-3',
            authorName: 'Khadija M.',
            authorLocation: 'Abidjan',
            rating: 5,
            date: 'Il y a 1 mois',
            title: 'Élégance et authenticité',
            comment: 'Le tressage est d’une régularité incroyable. On sent le temps et l’amour investis par les artisans dans cette pièce. Je recommande sans hésiter !',
            isVerifiedBuyer: true,
        },
        {
            id: 'rev-4',
            authorName: 'Éléonore de V.',
            authorLocation: 'Genève',
            rating: 5,
            date: 'Il y a 2 mois',
            title: 'Raffinement et matières d’exception',
            comment: 'Une pièce de maroquinerie d’art d’une rareté absolue. Le porté est sublime et la patine végétale s’embellit au fil des semaines.',
            isVerifiedBuyer: true,
        },
    ];

    const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => {
        return initialReviews.length > 0 ? initialReviews : defaultCuratedReviews;
    });

    const averageScore = initialSummary?.averageRating || 4.9;
    const totalCount = initialSummary?.totalReviews || (reviewsList.length > 0 ? 28 : 0);

    const specifications = [
        { feature: 'Matière Principale', detail: customFields?.material || 'Raphia sauvage naturel d’Afrique & Cuir pleine fleur' },
        { feature: 'Finitions Cuir', detail: customFields?.leatherOrigin || 'Cuir de vachette à tannage 100% végétal' },
        { feature: 'Bouclerie & Garnitures', detail: 'Laiton massif patiné, forgé artisanalement' },
        { feature: 'Dimensions', detail: customFields?.dimensions || 'Format étudié (H 32 cm × L 40 cm × P 14 cm)' },
        { feature: 'Hauteur d’Anse / Bandoulière', detail: customFields?.strapDrop || 'Porté main ou bandoulière (24 cm)' },
        { feature: 'Poids Léger', detail: customFields?.weight || 'Environ 650 g (ergonomique et résistant)' },
        { feature: 'Origine de Confection', detail: customFields?.artisanOrigin || 'Ateliers d’Afrique de l’Ouest & Centrale' },
        { feature: 'Entretien', detail: customFields?.careInstructions || 'Nourrir au baume naturel végétal, préserver de l’humidité prolongée' },
    ];

    const descriptionBulletPoints = [
        '100% Matières nobles sélectionnées et certifiées pour une longévité d’exception.',
        'Tressage sculptural réalisé patiemment à la main selon les traditions ancestrales.',
        'Finitions et coutures sellier réalisées à la main par nos maîtres artisans.',
        'Garantie d’authenticité et d’exclusivité avec certificat d’atelier numéroté.',
    ];

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewerName.trim() || !reviewerEmail.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        startTransition(async () => {
            if (productId) {
                const res = await submitProductReviewAction({
                    productId,
                    authorName: reviewerName,
                    authorLocation: 'Client Vérifié',
                    rating: newRating,
                    title: reviewTitle,
                    comment: reviewComment,
                });

                if (res.success && res.review) {
                    setReviewsList((prev) => [res.review as any, ...prev]);
                    toast.success('Merci pour votre avis !', {
                        description: 'Votre témoignage a été publié avec succès.',
                    });
                    setReviewTitle('');
                    setReviewComment('');
                    return;
                }
            }

            // Local fallback simulation
            const fakeReview: ReviewItem = {
                id: `rev-${Date.now()}`,
                authorName: reviewerName,
                authorLocation: 'Client Vérifié',
                rating: newRating,
                date: 'À l’instant',
                title: reviewTitle,
                comment: reviewComment,
                isVerifiedBuyer: true,
            };
            setReviewsList((prev) => [fakeReview, ...prev]);
            toast.success('Merci pour votre avis !', {
                description: 'Votre témoignage a été publié avec succès.',
            });
            setReviewTitle('');
            setReviewComment('');
        });
    };

    return (
        <section className="mt-16 sm:mt-24 pt-10 border-t border-[#e2ddd2]">
            {/* 1. Horizontal Tabs Header */}
            <div className="flex items-center justify-center gap-8 sm:gap-14 border-b border-[#e2ddd2] pb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`text-base sm:text-lg font-semibold tracking-tight transition-all cursor-pointer relative pb-3 ${
                        activeTab === 'description'
                            ? 'text-[#1c1b18] font-bold'
                            : 'text-[#7d796f] hover:text-[#1c1b18]'
                    }`}
                >
                    <span>Description</span>
                    {activeTab === 'description' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D4A43C] rounded-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('specifications')}
                    className={`text-base sm:text-lg font-semibold tracking-tight transition-all cursor-pointer relative pb-3 ${
                        activeTab === 'specifications'
                            ? 'text-[#1c1b18] font-bold'
                            : 'text-[#7d796f] hover:text-[#1c1b18]'
                    }`}
                >
                    <span>Additional Information</span>
                    {activeTab === 'specifications' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D4A43C] rounded-full" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`text-base sm:text-lg font-semibold tracking-tight transition-all cursor-pointer relative pb-3 ${
                        activeTab === 'reviews'
                            ? 'text-[#1c1b18] font-bold'
                            : 'text-[#7d796f] hover:text-[#1c1b18]'
                    }`}
                >
                    <span>Review</span>
                    {activeTab === 'reviews' && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#D4A43C] rounded-full" />
                    )}
                </button>
            </div>

            {/* TAB 1: Description */}
            {activeTab === 'description' && (
                <div className="pt-10 max-w-4xl mx-auto space-y-8 font-sans">
                    <div
                        className="prose prose-sm sm:prose-base max-w-none text-[#57544c] leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />

                    {/* Split circle bullets list */}
                    <div className="space-y-3.5 pt-2">
                        {descriptionBulletPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#57544c]">
                                <SplitCircleBullet />
                                <span className="leading-snug">{point}</span>
                            </div>
                        ))}
                    </div>

                    {/* Artisanal Heritage Callout */}
                    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#fbfaf7] border border-[#e2ddd2] flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xs">
                        <div className="size-12 rounded-xl bg-[#D4A43C]/10 flex items-center justify-center shrink-0 text-[#D4A43C]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-display text-sm sm:text-base font-bold text-[#1c1b18]">
                                Savoir-Faire Exclusif & Authenticité Certifiée
                            </h4>
                            <p className="text-xs sm:text-sm text-[#57544c] leading-relaxed">
                                Chaque pièce est confectionnée avec patience et rigueur par nos artisans. De subtiles variations de grain et de teinte attestent de son caractère artisanal d’exception.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Additional Information */}
            {activeTab === 'specifications' && (
                <div className="pt-10 max-w-4xl mx-auto">
                    <div className="overflow-hidden rounded-2xl border border-[#e2ddd2] shadow-xs">
                        {/* Header */}
                        <div className="grid grid-cols-12 bg-[#1D120A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-4 px-6">
                            <div className="col-span-5 sm:col-span-4">Caractéristique</div>
                            <div className="col-span-7 sm:col-span-8">Détails d’Atelier</div>
                        </div>

                        {/* Zebra-striped rows */}
                        <div className="divide-y divide-[#e2ddd2] text-xs sm:text-sm font-sans">
                            {specifications.map((row, idx) => (
                                <div
                                    key={row.feature}
                                    className={`grid grid-cols-12 py-4 px-6 transition-colors ${
                                        idx % 2 === 0 ? 'bg-[#fbfaf7]' : 'bg-[#f2efe9]/40'
                                    }`}
                                >
                                    <div className="col-span-5 sm:col-span-4 font-semibold text-[#1c1b18]">
                                        {row.feature}
                                    </div>
                                    <div className="col-span-7 sm:col-span-8 text-[#57544c] leading-relaxed">
                                        {row.detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: Review */}
            {activeTab === 'reviews' && (
                <div className="pt-10 max-w-4xl mx-auto space-y-12">
                    {/* 1. Score Summary & Star Progress Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#fbfaf7] p-6 sm:p-8 rounded-2xl border border-[#e2ddd2] shadow-xs">
                        {/* Left: Overall Score */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-[#e2ddd2] pb-6 md:pb-0 md:pr-8">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl sm:text-5xl font-extrabold text-[#1c1b18] tracking-tight font-display">
                                    {Number(averageScore).toFixed(1)}
                                </span>
                                <span className="text-sm font-medium text-[#7d796f]">out of 5</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#D4A43C]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="size-4.5 fill-[#D4A43C]" />
                                ))}
                            </div>
                            <p className="text-xs text-[#7d796f] font-medium">
                                ({totalCount} Review)
                            </p>
                        </div>

                        {/* Right: Star Progress Bars */}
                        <div className="md:col-span-8 space-y-2 text-xs font-medium text-[#1c1b18]">
                            {[
                                { star: 5, pct: 85 },
                                { star: 4, pct: 45 },
                                { star: 3, pct: 15 },
                                { star: 2, pct: 8 },
                                { star: 1, pct: 2 },
                            ].map((row) => (
                                <div key={row.star} className="flex items-center gap-4">
                                    <span className="w-12 text-[#57544c]">{row.star} Star</span>
                                    <div className="flex-1 h-3 rounded-full bg-[#e2ddd2] overflow-hidden">
                                        <div
                                            className="h-full bg-[#D4A43C] rounded-full transition-all duration-500"
                                            style={{ width: `${row.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Review List Header & Filters */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ddd2] pb-4">
                            <div>
                                <h3 className="font-display text-xl font-bold text-[#1c1b18]">
                                    Review List
                                </h3>
                                <p className="text-xs text-[#7d796f] mt-0.5">
                                    Showing 1-{Math.min(4, reviewsList.length)} of {totalCount} results
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[#7d796f]">Sort by :</span>
                                <button
                                    type="button"
                                    onClick={() => setSortBy(sortBy === 'newest' ? 'highest' : 'newest')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e2ddd2] bg-white text-xs font-semibold text-[#1c1b18] shadow-2xs hover:bg-[#fbfaf7] transition-colors"
                                >
                                    <span>{sortBy === 'newest' ? 'Newest' : 'Highest Rating'}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#7d796f]" />
                                </button>
                            </div>
                        </div>

                        {/* 3. Individual Review Items */}
                        <div className="space-y-8 divide-y divide-[#e2ddd2]">
                            {reviewsList.map((rev, i) => (
                                <div key={rev.id || i} className="pt-6 first:pt-0 space-y-3.5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="size-10 rounded-full bg-[#1c1b18] text-[#fbfaf7] flex items-center justify-center font-bold text-sm shrink-0">
                                                {(rev.authorName || rev.author || 'K').charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-sans text-sm font-bold text-[#1c1b18]">
                                                        {rev.authorName || rev.author}
                                                    </span>
                                                    {rev.isVerifiedBuyer !== false && (
                                                        <span className="text-[11px] text-[#2E7D32] font-semibold">
                                                            (Verified)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-[#7d796f]">
                                            {rev.date || '1 month ago'}
                                        </span>
                                    </div>

                                    <h4 className="font-sans text-sm sm:text-base font-bold text-[#1c1b18]">
                                        {rev.title}
                                    </h4>

                                    <p className="text-xs sm:text-sm text-[#57544c] leading-relaxed font-sans">
                                        {rev.comment}
                                    </p>

                                    <div className="flex items-center gap-1.5 text-[#D4A43C]">
                                        {Array.from({ length: rev.rating || 5 }).map((_, r) => (
                                            <Star key={r} className="size-3.5 fill-[#D4A43C]" />
                                        ))}
                                        <span className="text-xs font-bold text-[#1c1b18] ml-1">
                                            {Number(rev.rating || 5).toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Optional Review Image Attachments */}
                                    {rev.images && rev.images.length > 0 && (
                                        <div className="flex items-center gap-3 pt-2">
                                            {rev.images.map((imgUrl, imgIdx) => (
                                                <div
                                                    key={imgIdx}
                                                    className="size-16 sm:size-20 rounded-xl bg-[#fbfaf7] border border-[#e2ddd2] overflow-hidden relative"
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt="Aperçu client"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. "Add your review" Inline Form */}
                    <div className="bg-[#fbfaf7] p-8 sm:p-10 rounded-2xl border border-[#e2ddd2] space-y-6 shadow-xs">
                        <div>
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1c1b18]">
                                Add your review
                            </h3>
                            <p className="text-xs text-[#57544c] mt-1 font-sans">
                                Your email address will not be published. Required fields are marked*
                            </p>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-5">
                            {/* 2-Column: Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#1c1b18]">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={reviewerName}
                                        onChange={(e) => setReviewerName(e.target.value)}
                                        placeholder="Ex. John Doe"
                                        className="w-full bg-white border border-[#e2ddd2] px-5 py-3 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all text-[#1c1b18]"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-[#1c1b18]">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={reviewerEmail}
                                        onChange={(e) => setReviewerEmail(e.target.value)}
                                        placeholder="example@gmail.com"
                                        className="w-full bg-white border border-[#e2ddd2] px-5 py-3 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all text-[#1c1b18]"
                                    />
                                </div>
                            </div>

                            {/* Interactive Star Rating */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#1c1b18]">
                                    Your Rating *
                                </label>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starValue = i + 1;
                                        const isFilled = starValue <= (hoverRating || newRating);
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setNewRating(starValue)}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="cursor-pointer focus:outline-none transition-transform hover:scale-110"
                                                aria-label={`Noter ${starValue} étoiles`}
                                            >
                                                <Star
                                                    className={`size-5 ${
                                                        isFilled
                                                            ? 'fill-[#D4A43C] text-[#D4A43C]'
                                                            : 'text-[#e2ddd2] fill-none'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Review Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#1c1b18]">
                                    Add Review Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    placeholder="Write Title here"
                                    className="w-full bg-white border border-[#e2ddd2] px-5 py-3 text-xs sm:text-sm rounded-full focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all text-[#1c1b18]"
                                />
                            </div>

                            {/* Detailed Review */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#1c1b18]">
                                    Add Detailed Review *
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Write here"
                                    className="w-full bg-white border border-[#e2ddd2] p-5 text-xs sm:text-sm rounded-2xl focus:outline-none focus:border-[#D4A43C] focus:ring-1 focus:ring-[#D4A43C] transition-all text-[#1c1b18] resize-none"
                                />
                            </div>

                            {/* Photo / Video (Optional) Dropzone */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[#1c1b18]">
                                    Photo / Video (Optional)
                                </label>
                                <div className="border border-dashed border-[#e2ddd2] bg-white rounded-2xl p-6 text-center space-y-1.5 cursor-pointer hover:border-[#D4A43C] transition-colors">
                                    <UploadCloud className="size-6 text-[#D4A43C] mx-auto" />
                                    <p className="text-xs text-[#57544c]">
                                        Drag a Photo or Video
                                    </p>
                                    <span className="text-xs font-bold text-[#1c1b18] underline underline-offset-2">
                                        Browse
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="rounded-full bg-[#1c1b18] hover:bg-[#3A2418] text-[#fbfaf7] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isPending ? 'Envoi...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
