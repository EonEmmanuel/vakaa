import type {TadaDocumentNode} from 'gql.tada';
import {print} from 'graphql';
import {getAuthToken} from './auth-token';

const VENDURE_API_URL = process.env.VENDURE_SHOP_API_URL || process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL;
const VENDURE_CHANNEL_TOKEN = process.env.VENDURE_CHANNEL_TOKEN || process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN || '__default_channel__';
const VENDURE_AUTH_TOKEN_HEADER = process.env.VENDURE_AUTH_TOKEN_HEADER || 'vendure-auth-token';
const VENDURE_CHANNEL_TOKEN_HEADER = process.env.VENDURE_CHANNEL_TOKEN_HEADER || 'vendure-token';

const queryPrintCache = new WeakMap<object, string>();

function printDocument(document: unknown): string {
    if (typeof document === 'object' && document !== null) {
        const cached = queryPrintCache.get(document);
        if (cached) return cached;
        const printed = print(document as any);
        queryPrintCache.set(document, printed);
        return printed;
    }
    return print(document as any);
}

if (!VENDURE_API_URL) {
    throw new Error('VENDURE_SHOP_API_URL or NEXT_PUBLIC_VENDURE_SHOP_API_URL environment variable is not set');
}

interface VendureRequestOptions {
    token?: string;
    useAuthToken?: boolean;
    channelToken?: string;
    languageCode?: string;
    currencyCode?: string;
    fetch?: RequestInit;
    tags?: string[];
    /**
     * Bound interactive mutations separately from slower catalogue reads.
     * A caller may still provide its own AbortSignal through `fetch`.
     */
    timeoutMs?: number;
}

interface VendureResponse<T> {
    data?: T;
    errors?: Array<{ message: string; [key: string]: unknown }>;
}

export type VendureRequestError = {
    kind: 'network' | 'timeout' | 'http' | 'graphql' | 'invalid-response';
    message?: string;
    status?: number;
};

type VendureResult<T> = {data: T; token?: string; error?: VendureRequestError};

/**
 * Extract the Vendure auth token from response headers
 */
function extractAuthToken(headers: Headers): string | null {
    return headers.get(VENDURE_AUTH_TOKEN_HEADER);
}


/**
 * Execute a GraphQL query against the Vendure API
 */
export async function query<TResult, TVariables>(
    document: TadaDocumentNode<TResult, TVariables>,
    ...[variables, options]: TVariables extends Record<string, never>
        ? [variables?: TVariables, options?: VendureRequestOptions]
        : [variables: TVariables, options?: VendureRequestOptions]
): Promise<VendureResult<TResult>> {
    const {
        token,
        useAuthToken,
        channelToken,
        languageCode,
        currencyCode,
        fetch: fetchOptions,
        tags,
        timeoutMs,
    } = options || {};

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions?.headers as Record<string, string>),
    };

    // Use the explicitly provided token, or fetch from cookies if useAuthToken is true
    let authToken = token;
    if (useAuthToken && !authToken) {
        authToken = await getAuthToken();
    }

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Set the channel token header (use provided channelToken or default)
    headers[VENDURE_CHANNEL_TOKEN_HEADER] = channelToken || VENDURE_CHANNEL_TOKEN;

    const url = new URL(VENDURE_API_URL!);
    if (languageCode) {
        url.searchParams.set('languageCode', languageCode);
    }
    // Base channel catalog and settlement are in XAF.
    // Omit foreign reference currencies (EUR/USD) from Vendure query params
    // to prevent "No price information was found" errors.
    if (currencyCode && currencyCode === 'XAF') {
        url.searchParams.set('currencyCode', currencyCode);
    }

    let response: Response;
    try {
        response = await fetch(url.toString(), {
            ...fetchOptions,
            method: 'POST',
            headers,
            body: JSON.stringify({
                query: printDocument(document),
                variables: variables || {},
            }),
            signal: fetchOptions?.signal || AbortSignal.timeout(timeoutMs ?? 35000),
            ...(tags && {next: {tags}}),
        });
    } catch (networkError) {
        const isTimeout = networkError instanceof Error && networkError.name === 'TimeoutError';
        console.warn(
            '[Vendure API Warning]: Network request failed or timed out:',
            networkError instanceof Error ? networkError.message : networkError
        );
        return {
            data: {} as TResult,
            error: {kind: isTimeout ? 'timeout' : 'network'},
        };
    }

    if (!response.ok) {
        return {
            data: {} as TResult,
            error: {kind: 'http', status: response.status},
        };
    }

    try {
        const result: VendureResponse<TResult> = await response.json();
        const newToken = extractAuthToken(response.headers);

        return {
            data: result.data || ({} as TResult),
            ...(newToken && {token: newToken}),
            ...(result.errors?.length
                ? {error: {kind: 'graphql' as const, message: result.errors[0]?.message}}
                : {}),
        };
    } catch {
        return {
            data: {} as TResult,
            error: {kind: 'invalid-response'},
        };
    }
}

/**
 * Execute a GraphQL mutation against the Vendure API
 */
export async function mutate<TResult, TVariables>(
    document: TadaDocumentNode<TResult, TVariables>,
    ...[variables, options]: TVariables extends Record<string, never>
        ? [variables?: TVariables, options?: VendureRequestOptions]
        : [variables: TVariables, options?: VendureRequestOptions]
): Promise<VendureResult<TResult>> {
    // Mutations use the same underlying implementation as queries in GraphQL
    // @ts-expect-error - Complex conditional type inference, runtime behavior is correct
    return query(document, variables, options);
}
