// Transparent studio product PNGs (clean cutouts), keyed by product slug.
// Baked into the storefront bundle as a deliberate fallback layer on top of
// backend asset previews; products without a cutout entry fall back to their
// real productAsset preview or a neutral placeholder graphic.
export const TRANSPARENT_LOCAL_IMAGES: Record<string, string> = {
    'maa-tote': '/images/bags/maa-tote-transparent.png',
    'cabas-maa-raphia': '/images/bags/maa-tote-transparent.png',
    'kemi-shoulder-bag': '/images/bags/kemi-shoulder-transparent.png',
    'porte-epaule-kemi': '/images/bags/kemi-shoulder-transparent.png',
    'zuri-clutch': '/images/bags/zuri-clutch-transparent.png',
    'pochette-zuri-laiton': '/images/bags/zuri-clutch-transparent.png',
    'asa-crossbody': '/images/bags/asa-crossbody-transparent.png',
    'aya-cardholder': '/images/bags/aya-cardholder-transparent.png',
    'baguette-indigo-savane': '/images/bags/baguette-indigo-savane-transparent.png',
    'baguette-terre-emeraude': '/images/bags/baguette-terre-emeraude-transparent.png',
};

export const PRIMARY_LOCAL_FALLBACKS: Record<string, string> = TRANSPARENT_LOCAL_IMAGES;
