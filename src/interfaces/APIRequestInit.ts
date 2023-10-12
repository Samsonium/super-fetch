export default interface APIRequestInit<Q, P extends Record<string, any>, B> {

    /** Query parameters */
    query: Q,

    /** Path parameters */
    params: P,

    /** Body */
    body: B
}
