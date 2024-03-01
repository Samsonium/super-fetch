import { ApiRecord } from '../repo/ApiRecord';
import { ApiRequestInit } from '../repo/ApiRequestInit';
import { FetchResponse } from '../repo/FetchResponse';
import { ApiParamsError } from '../errors/ApiParamsError';
import { ApiUrlError } from '../errors/ApiUrlError';
import { ApiResponseError } from '../errors/ApiResponseError';

/**
 * Fetch using ApiRecord response.
 *
 * @param apiRecord ApiRecord info
 * @param init Request init object
 * @param baseURL Base URl of requesting method
 *
 * @template Q  Query parameters
 * @template P  Path parameters
 * @template SR Successful response body
 * @template ER Error response body
 * @template B  Request body
 *
 * @example GET request
 *  await fetchApi(someGETRecord, {
 *      query: {
 *          page: 0,
 *          per_page: 10
 *      }
 *  });
 *
 * @example POST request
 *  await fetchApi(somePOSTRecord, {
 *      body: userData
 *  });
 *
 * @example With headers
 *  await fetchApi(someRecord, {
 *      headers: {
 *          'Accept': 'application/json'
 *      }
 *  }
 *
 * @example With access token
 *  await fetchApi(someRecord, {
 *      headers: {
 *          'Authorization': `Bearer ${access_token}`
 *      }
 *  }
 */
export async function fetchApi<Q, P, SR, ER, B>(
    apiRecord: ApiRecord<Q, P, SR, ER, B>,
    init?: ApiRequestInit<Q, P, B>,
    baseURL?: string
): Promise<FetchResponse<SR, ER>> {
    init ??= {} as ApiRequestInit<Q, P, B>;
    let requestInit: RequestInit = {
        method: apiRecord.method
    };

    // Make URL for the request
    let url: URL;
    try {
        url = new URL(apiRecord.endpoint, baseURL);
    } catch (e) {
        throw new ApiUrlError(apiRecord.endpoint, baseURL);
    }

    // Add extra options if exists
    if (init.extra) requestInit = {
        ...requestInit,
        ...init.extra,
    };

    // Add headers if exists
    if (init.headers) requestInit.headers = init.headers;

    // Check for path parameters
    if (url.pathname.includes(':')) {
        if (!('path' in init))
            throw new ApiParamsError();

        // Get params object
        const values = init.path as Record<string, any>;

        // Extract variables from endpoint
        const names = url.pathname.split('/')
            .filter((part) => part.startsWith(':') && part.length > 1)
            .map((part) => part.substring(1));

        // Replace variables with values
        for (const name of names) {
            if (!(name in values)) continue;
            url.pathname = url.pathname.replaceAll(new RegExp(':' + name, 'g'), values[name]);
        }

        // Verifying that all variables has been replaced
        if (url.pathname.includes(':')) {
            const missing = url.pathname.split('/')
                .filter((part) => part.startsWith(':') && part.length > 1)
                .map((part) => part.substring(1));
            throw new ApiParamsError(missing);
        }
    }

    // Add query params if exists
    if (init.query) {
        for (const name in init.query)
            url.searchParams.set(name, String(init.query[name]))
    }

    // Check body
    if ('body' in init) {
        if (typeof init.body === 'object') {
            requestInit.body = JSON.stringify(init.body);

            if (!requestInit.headers) requestInit.headers = {};
            requestInit.headers['Content-Type' as keyof HeadersInit] = 'application/json';
        } else requestInit.body = String(init.body);
    }

    // Make request and catch execution error
    let response: Response;
    try {
        response = await fetch(url, requestInit);
    } catch (err) {
        const text = 'Request failed: ' + (err instanceof Error ? err.message : err);

        if (init.throwsOnError)
            throw new ApiResponseError(0, text);

        return {
            ok: false,
            statusCode: 0,
            statusText: text,
            data: null
        };
    }

    // Throw an error if response is not finished
    // successfully and throwsOnError set to true
    if (!response.ok && init.throwsOnError)
        throw new ApiResponseError(response.status, response.statusText);

    let parsedData: SR | ER | null;
    try {
        parsedData = await response.json();
    } catch (err) {
        const text = 'JSON parse failed: ' + (err instanceof Error ? err.message : err);

        if (init.throwsOnError)
            throw new ApiResponseError(0, text);

        return {
            ok: false,
            statusCode: 0,
            statusText: text,
            data: null
        };
    }

    return {
        ok: response.ok,
        statusCode: response.status,
        statusText: response.statusText,
        data: parsedData
    };
}
