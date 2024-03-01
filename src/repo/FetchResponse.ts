/**
 * Return type from `fetchAPI` function.
 *
 * @template S Successful response body
 * @template E Error response body
 */
export interface FetchResponse<S, E> {

    /**
     * Is response has code in range 200-299
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
     */
    ok: boolean;

    /**
     * HTTP status code
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/status
     */
    statusCode: number;

    /**
     * HTTP status text
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText
     */
    statusText: string;

    /** Parse JSON of response body */
    data: S | E | null;
}
