import type {TadaDocumentNode} from 'gql.tada';
import {print, type ASTNode} from 'graphql';
import {getAuthToken} from './auth-token';

const DEFAULT_VENDURE_API_URL = 'https://api.vakaa.online/shop-api';
const DEFAULT_CHANNEL_TOKEN = '__default_channel__';
const DEFAULT_AUTH_TOKEN_HEADER = 'vendure-auth-token';
const DEFAULT_CHANNEL_TOKEN_HEADER = 'vendure-token';

export function getVendureApiUrl(): string {
    return (
        process.env.VENDURE_SHOP_API_URL ||
        process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL ||
        DEFAULT_VENDURE_API_URL
    );
}

export function getVendureServerUrl(): string {
    return getVendureApiUrl().replace(/\/shop-api\/?$/, '');
}

export function getVendureChannelToken(): string {
    return (
        process.env.VENDURE_CHANNEL_TOKEN ||
        process.env.NEXT_PUBLIC_VENDURE_CHANNEL_TOKEN ||
        DEFAULT_CHANNEL_TOKEN
    );
}

export function getVendureAuthTokenHeader(): string {
    return process.env.VENDURE_AUTH_TOKEN_HEADER || DEFAULT_AUTH_TOKEN_HEADER;
}

export function getVendureChannelTokenHeader(): string {
    return process.env.VENDURE_CHANNEL_TOKEN_HEADER || DEFAULT_CHANNEL_TOKEN_HEADER;
}

export const VENDURE_API_URL = getVendureApiUrl();
export const VENDURE_CHANNEL_TOKEN = getVendureChannelToken();
export const VENDURE_AUTH_TOKEN_HEADER = getVendureAuthTokenHeader();
export const VENDURE_CHANNEL_TOKEN_HEADER = getVendureChannelTokenHeader();

const queryPrintCache = new WeakMap<object, string>();

function printDocument(document: unknown): string {
    if (typeof document === 'object' && document !== null) {
        const cached = queryPrintCache.get(document);
        if (cached) return cached;
        const printed = print(document as ASTNode);
        queryPrintCache.set(document, printed);
        return printed;
    }
    return print(document as ASTNode);
}

function getOperationName(document: unknown): string {
    if (typeof document === 'object' && document !== null && 'definitions' in document) {
        const doc = document as { definitions?: Array<{ kind?: string; name?: { value?: string } }> };
        const op = doc.definitions?.find((def) => def.kind === 'OperationDefinition');
        if (op?.name?.value) {
            return op.name.value;
        }
    }
    try {
        const printed = printDocument(document);
        const match = printed.match(/(?:query|mutation|subscription)\s+([A-Za-z0-9_]+)/);
        if (match?.[1]) {
            return match[1];
        }
    } catch {}
    return 'anonymous';
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
    return headers.get(getVendureAuthTokenHeader());
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
    headers[getVendureChannelTokenHeader()] = channelToken || getVendureChannelToken();

    let url: URL;
    try {
        url = new URL(getVendureApiUrl());
    } catch {
        url = new URL(DEFAULT_VENDURE_API_URL);
    }
    if (languageCode) {
        url.searchParams.set('languageCode', languageCode);
    }
    // Base channel catalog and settlement are in XAF.
    // Omit foreign reference currencies (EUR/USD) from Vendure query params
    // to prevent "No price information was found" errors.
    if (currencyCode && currencyCode === 'XAF') {
        url.searchParams.set('currencyCode', currencyCode);
    }

    const startTime = performance.now();
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
        if (process.env.PERF_LOG === '1') {
            const durationMs = Math.round(performance.now() - startTime);
            const opName = getOperationName(document);
            console.info('[vendure-timing]', `${opName} ${durationMs}ms status=${response.status}`);
        }
    } catch (networkError) {
        if (process.env.PERF_LOG === '1') {
            const durationMs = Math.round(performance.now() - startTime);
            const opName = getOperationName(document);
            console.info('[vendure-timing]', `${opName} failed after ${durationMs}ms`);
        }
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
