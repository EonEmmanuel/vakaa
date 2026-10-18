// Canonical Vendure collection slugs for the storefront (verified against the
// live shop-api catalog: tote-bags, shoulder-bags, clutches, crossbodies,
// accessories). Home tabs and collection links derive from these — keep in
// sync with the backend catalog when collections change.
export const COLLECTION_TABS = [
    { slug: 'tote-bags', messageKey: 'toteBags' },
    { slug: 'shoulder-bags', messageKey: 'shoulderBags' },
    { slug: 'clutches', messageKey: 'clutches' },
    { slug: 'crossbodies', messageKey: 'crossbodies' },
    { slug: 'accessories', messageKey: 'accessories' },
] as const;

export type CollectionTab = (typeof COLLECTION_TABS)[number];

/** Signature collection used for the "featured pieces" carousel. */
export const FEATURED_COLLECTION_SLUG = 'tote-bags';
