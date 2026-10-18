import type {MessageLoaders} from '@/platform/i18n/messages';

export const trackingMessageLoaders: MessageLoaders = {
    en: () => import('./messages/en.json'),
    fr: () => import('./messages/fr.json'),
    de: () => import('./messages/de.json'),
};
