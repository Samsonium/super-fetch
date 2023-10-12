/**
 * API endpoint entry
 */
export default interface APIRecord<Query = object, Params = object, Response = object, Body = object> {

    /**
     * Endpoint URL.
     * Can contain path params like "/path/with/:var"
     */
    endpoint: string;

    /**
     * Request method
     */
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

    /**
     * Response and error handlers
     */
    handlers?: Partial<{
        onResponse: <T = object>(response: Response) => T;
        onError: <T = object>(code: number, response: Record<string, any>) => T;
    }>
}
