/**
 * Fetch request init based on ApiRecord.
 *
 * @template Q Query params
 * @template P Path params
 * @template B Request body
 */
export type ApiRequestInit<Q, P, B> = Partial<{
    /** Query parameters */
    query?: Q;
}> & (P extends null ? {} : {
    /** Path parameters */
    path: P;
}) & (B extends null ? {} : {
    /** Body */
    body: B;
});
