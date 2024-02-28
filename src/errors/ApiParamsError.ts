/**
 * Error in `fetchApi` if endpoint has variables
 * and no `params` field specified in `init` arg.
 */
export class ApiParamsError extends Error {
    public constructor(params?: string[]) {
        const message = params
            ? `The following fields is missing (${params.length}): `
                + params.map((param) => `"${param}"`).join(', ')
            : 'The endpoint contains variables, but the params field is missing in the init';
        super(message);
    }
}
