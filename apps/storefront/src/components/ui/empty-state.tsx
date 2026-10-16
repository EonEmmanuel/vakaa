'use client';

import { Link } from '@/platform/i18n/navigation';
import { ArrowRight, ShoppingBag, Search, Heart, Package, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type EmptyStateVariant =
  | 'cart'
  | 'search'
  | 'collection'
  | 'wishlist'
  | 'orders'
  | 'account'
  | 'generic';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  illustration?: React.ReactNode;
}

const variantConfig: Record<EmptyStateVariant, {
  icon: React.ReactNode;
  defaultTitle: string;
  defaultDescription: string;
  defaultAction: { label: string; href: string };
}> = {
  cart: {
    icon: <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Votre panier est vide',
    defaultDescription: 'Il n\'y a pas encore de créations dans votre panier. Découvrez nos collections et trouvez votre pièce unique.',
    defaultAction: { label: 'Découvrir la collection', href: '/search' },
  },
  search: {
    icon: <Search className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Aucun résultat',
    defaultDescription: 'Aucune création ne correspond à votre recherche. Essayez avec des termes différents ou réinitialisez vos filtres.',
    defaultAction: { label: 'Voir tout le catalogue', href: '/search' },
  },
  collection: {
    icon: <Package className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Collection vide',
    defaultDescription: 'Cette collection ne contient pas encore de créations. Revenez plus tard pour découvrir nos nouveautés.',
    defaultAction: { label: 'Explorer les collections', href: '/search' },
  },
  wishlist: {
    icon: <Heart className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Vos favoris sont vides',
    defaultDescription: 'Vous n\'avez pas encore ajouté de créations à vos favoris. Parcourez nos collections et cliquez sur le cœur pour sauvegarder vos coups de cœur.',
    defaultAction: { label: 'Découvrir la collection', href: '/search' },
  },
  orders: {
    icon: <Package className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Aucune commande',
    defaultDescription: 'Vous n\'avez pas encore passé de commande. Commencez votre expérience Vakaa en découvrant nos créations artisanales.',
    defaultAction: { label: 'Commencer mes achats', href: '/search' },
  },
  account: {
    icon: <Mail className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Bienvenue sur Vakaa',
    defaultDescription: 'Connectez-vous ou créez un compte pour accéder à vos commandes, adresses et favoris.',
    defaultAction: { label: 'Se connecter', href: '/sign-in' },
  },
  generic: {
    icon: <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700" />,
    defaultTitle: 'Rien à afficher',
    defaultDescription: 'Il n\'y a pas de contenu à afficher pour le moment.',
    defaultAction: { label: 'Retour à l\'accueil', href: '/' },
  },
};

export function EmptyState({
  variant,
  title,
  description,
  action,
  className,
  illustration,
}: EmptyStateProps) {
  const t = useTranslations('Common');
  const config = variantConfig[variant];

  const displayTitle = title || config.defaultTitle;
  const displayDescription = description || config.defaultDescription;
  const displayAction = action || config.defaultAction;
  const displayIllustration = illustration || config.icon;

  return (
    <div
      className={cn(
        'text-center py-16 px-6 rounded-3xl bg-[#F3EFE9] border border-[#E7DED0] space-y-4',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-center">
        {displayIllustration}
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <p className="font-sans text-lg sm:text-xl font-bold text-[#1D120A]">
          {displayTitle}
        </p>

        <p className="text-xs sm:text-sm text-[#3A2418]/70 leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {displayAction && (
        <div className="pt-2">
          <Link
            href={displayAction.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1D120A] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#3A2418] transition-colors cursor-pointer"
          >
            <span>{displayAction.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Specialized empty states with translated content
 */
export function CartEmptyState() {
  const t = useTranslations('Cart');
  return (
    <EmptyState
      variant="cart"
      title={t('emptyTitle')}
      description={t('emptyDescription')}
      action={{ label: t('continueShopping'), href: '/search' }}
    />
  );
}

export function SearchEmptyState({ query }: { query?: string }) {
  const t = useTranslations('Search');
  return (
    <EmptyState
      variant="search"
      title={t('noResultsTitle')}
      description={query ? t('noResultsDescription', { query }) : t('noResultsDescriptionGeneric')}
      action={{ label: t('browseAll'), href: '/search' }}
    />
  );
}

export function CollectionEmptyState() {
  const t = useTranslations('Collection');
  return (
    <EmptyState
      variant="collection"
      title={t('emptyTitle')}
      description={t('emptyDescription')}
      action={{ label: t('browseCollections'), href: '/search' }}
    />
  );
}

export function WishlistEmptyState() {
  const t = useTranslations('Wishlist');
  return (
    <EmptyState
      variant="wishlist"
      title={t('emptyTitle')}
      description={t('emptyDescription')}
      action={{ label: t('browseProducts'), href: '/search' }}
    />
  );
}

export function OrdersEmptyState() {
  const t = useTranslations('Orders');
  return (
    <EmptyState
      variant="orders"
      title={t('emptyTitle')}
      description={t('emptyDescription')}
      action={{ label: t('startShopping'), href: '/search' }}
    />
  );
}

export function AccountEmptyState() {
  const t = useTranslations('Account');
  return (
    <EmptyState
      variant="account"
      title={t('welcomeTitle')}
      description={t('welcomeDescription')}
      action={{ label: t('signIn'), href: '/sign-in' }}
    />
  );
}