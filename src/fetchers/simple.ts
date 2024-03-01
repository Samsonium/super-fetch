import { ApiRequestInit } from '../repo/ApiRequestInit';

/** Fetch response with JSON and text out */
type FetchResponse<S, E> = {
    json: () => Promise<S | E | null>,
    text: () => Promise<string | null>
}

/**
 * Base function for simple requests
 * @param method HTTP method
 * @param url Request URL
 * @param init Request options
 */
async function makeRequest<S = any, E = any>(
    method: string,
    url: string | URL,
    init?: ApiRequestInit<any, null, any>
): Promise<FetchResponse<S, E>> {
    init ??= {};

    // Create fetch request options
    let options: RequestInit = { method };

    // Create requesting url
    let resultURL = url instanceof URL
        ? url
        : new URL(url);

    // Check query parameters
    if ('query' in init) {
        for (const name in init.query)
            resultURL.searchParams.set(name, String(init.query[name]));
    }

    // Check extras
    if ('extra' in init) options = {
        ...options,
        ...init.extra
    };

    // Check body
    if ('body' in init) {
        options = {
            ...options,
            body: typeof init.body === 'object'
                ? JSON.stringify(init.body)
                : init.body
        };

        if (typeof init.body === 'object') {
            if (!options.headers)
                options.headers = {};
            options.headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };
        }
    }

    // Make request
    let response: Response;
    try {
        response = await fetch(resultURL, options);
    } catch (e) {
        const text = 'Request failed: ' + (e instanceof Error ? e.message : e);

        if (init.throwsOnError)
            throw new Error(text);

        return {
            json: async () => null,
            text: async () => null
        };
    }

    // Throw an error if response is not finished
    // successfully and throwsOnError set to true
    if (!response.ok && init.throwsOnError)
        throw new Error(`Request failed: [${response.status}]: ${response.statusText}`);

    // Get text contents
    const data = await response.text();

    // Return generated functions
    return {
        json: async () => {
            try {
                return JSON.parse(data) as S | E;
            } catch (e) {
                const text = 'JSON parsing failed: ' + (e instanceof Error ? e.message : e);

                if (init?.throwsOnError)
                    throw new Error(text);

                return null;
            }
        },
        text: async () => data
    };
}
