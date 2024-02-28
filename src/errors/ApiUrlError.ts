
export class ApiUrlError extends Error {
    constructor(url: string, baseURL?: string) {
        const message = baseURL
            ? `Cannot construct url with base "${baseURL}" and path "${url}"`
            : `Cannot construct url "${url}"`;
        super(message);
    }
}
