/**
 * Throws in `fetchApi` if `throwsOnError`
 * set to true in init argument.
 */
export class ApiResponseError extends Error {
    constructor(code: number, text: string) {
        super(`Request error [${code}]: ${text}`);
    }
}
