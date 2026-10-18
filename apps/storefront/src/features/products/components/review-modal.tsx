'use client';

import { useState } from 'react';
import { Star, Loader2, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { submitProductReviewAction, type ProductReview } from '../submit-review';
import { useRouter } from '@/platform/i18n/navigation';

interface ReviewModalProps {
    productId: string;
    productName: string;
    onReviewSubmitted?: (review: ProductReview) => void;
}

export function ReviewModal({ productId, productName, onReviewSubmitted }: ReviewModalProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [authorName, setAuthorName] = useState('');
    const [authorLocation, setAuthorLocation] = useState('');
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authorName.trim() || !title.trim() || !comment.trim()) {
            toast.error('Veuillez renseigner votre nom, un titre et votre témoignage.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await submitProductReviewAction({
                productId,
                authorName,
                authorLocation,
                rating,
                title,
                comment,
            });

            if (res.success) {
                toast.success('Votre avis d’atelier a été publié avec succès !', {
                    description: `Merci d’honorer le travail de nos artisans pour "${productName}".`,
                });
                setOpen(false);
                setAuthorName('');
                setAuthorLocation('');
                setTitle('');
                setComment('');
                setRating(5);
                if (onReviewSubmitted && res.review) {
                    onReviewSubmitted(res.review);
                }
                router.refresh();
            } else {
                toast.error(res.error || 'Erreur lors de la publication.');
            }
        } catch {
            toast.error('Une erreur inattendue est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className="rounded-full border-[#E7DED0] hover:border-[#D4A43C] bg-white text-[#1D120A] text-xs font-semibold px-5 h-10 shadow-xs transition-colors cursor-pointer"
                    >
                        <Sparkles className="size-3.5 text-[#D4A43C] mr-2" />
                        <span>Partager mon Témoignage</span>
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-md bg-[#FAF8F5] border-[#E7DED0] rounded-2xl p-6">
                <DialogHeader className="text-left space-y-1">
                    <DialogTitle className="font-sans text-xl font-bold tracking-tight text-[#1D120A]">
                        Avis d’Atelier & Savoir-Faire
                    </DialogTitle>
                    <p className="text-xs text-[#3A2418]/70">
                        Votre retour sur « {productName} » guide notre atelier et nos futurs acquéreurs.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Star Rating Picker */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-[#1D120A]">Note d’Excellence</Label>
                        <div className="flex items-center gap-1.5 pt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                                >
                                    <Star
                                        className={`size-6 transition-colors ${
                                            (hoverRating || rating) >= star
                                                ? 'fill-[#D4A43C] text-[#D4A43C]'
                                                : 'text-stone-300'
                                        }`}
                                    />
                                </button>
                            ))}
                            <span className="text-xs font-bold text-[#A66B2D] ml-2">
                                {hoverRating || rating} / 5
                            </span>
                        </div>
                    </div>

                    {/* Author & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="authorName" className="text-xs font-semibold text-[#1D120A]">
                                Votre Nom ou Initiales *
                            </Label>
                            <Input
                                id="authorName"
                                placeholder="ex. Aïssatou D."
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                required
                                className="bg-white border-[#E7DED0] rounded-xl h-10 text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="authorLocation" className="text-xs font-semibold text-[#1D120A]">
                                Ville / Pays
                            </Label>
                            <Input
                                id="authorLocation"
                                placeholder="ex. Dakar & Paris"
                                value={authorLocation}
                                onChange={(e) => setAuthorLocation(e.target.value)}
                                className="bg-white border-[#E7DED0] rounded-xl h-10 text-xs"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="reviewTitle" className="text-xs font-semibold text-[#1D120A]">
                            Titre de votre Avis *
                        </Label>
                        <Input
                            id="reviewTitle"
                            placeholder="ex. Un chef-d’œuvre d’artisanat contemporain"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-white border-[#E7DED0] rounded-xl h-10 text-xs"
                        />
                    </div>

                    {/* Comment */}
                    <div className="space-y-1.5">
                        <Label htmlFor="reviewComment" className="text-xs font-semibold text-[#1D120A]">
                            Votre Expérience & Appréciation *
                        </Label>
                        <Textarea
                            id="reviewComment"
                            rows={4}
                            placeholder="Partagez vos impressions sur le tressage, le cuir pleine fleur, l’ergonomie ou la tenue..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="bg-white border-[#E7DED0] rounded-xl text-xs resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl bg-[#1B3B2B] hover:bg-[#122A1E] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin mr-2" />
                                <span>Publication en cours...</span>
                            </>
                        ) : (
                            <span>Publier mon Avis</span>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
