'use server';

import { query } from '@/platform/vendure/api';
import { SearchProductsQuery } from './graphql';

export async function clientSearch(term: string) {
    if (!term || !term.trim()) {
        return [];
    }

    try {
        const result = await query(SearchProductsQuery, {
            input: {
                term: term.trim(),
                take: 6,
                groupByProduct: true,
            },
        });
        return result.data?.search?.items || [];
    } catch (e) {
        console.error('Client search error', e);
        return [];
    }
}

export type ClientSearchResult = Awaited<ReturnType<typeof clientSearch>>[number];
