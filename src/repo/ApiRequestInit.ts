/**
 * Fetch request init based on ApiRecord.
 *
 * @template Q Query params
 * @template P Path params
 * @template B Request body
 */
export type ApiRequestInit<Q, P, B> = Partial<{
    /** Query parameters */
    query: Q;

    /** Should throw an error if request fails */
    throwsOnError: boolean;

    /** List of headers that will be applied to request */
    headers: HeadersInit;

    /** Extra options for Fetch API */
    extra: Partial<{

        /**
         * Interaction with browser's HTTP cache
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials
         */
        cache: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';

        /**
         * What browser need to do with credentials
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials
         */
        credentials: 'omit' | 'same-origin' | 'include';

        /**
         * Allow the request to outlive the page
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive
         */
        keepalive: boolean;

        /**
         * Request mode
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#mode
         */
        mode: 'cors' | 'no-cors' | 'same-origin';

        /**
         * Priority of the fetch request relative to other requests
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#priority
         */
        priority: 'high' | 'low' | 'auto';

        /**
         * How to handle redirect response
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#redirect
         */
        redirect: 'follow' | 'error' | 'manual';

        /**
         * Referrer of the request
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#referrer
         */
        referrer: string;

        /**
         * Referrer policy to use for the request
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#referrerpolicy
         */
        referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin'
            | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';

        /**
         * AbortSignal object instance. Allows to communicate with a fetch
         * request and abort it if desired via an AbortController
         * @see https://developer.mozilla.org/en-US/docs/Web/API/fetch#referrerpolicy
         */
        signal: AbortSignal;
    }>
}> & (P extends null ? {} : {
    /** Path parameters */
    path: P;
}) & (B extends null ? {} : {
    /** Body */
    body: B;
});
