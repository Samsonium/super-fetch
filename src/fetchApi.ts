import ParamsError from './errors/ParamsError';
import APIRecord from './interfaces/APIRecord';
import APIRequestInit from './interfaces/APIRequestInit';

export default async function fetchApi<Q, P, R, B>(method: APIRecord<Q, P, R, B>, setup: Partial<APIRequestInit<Q, P, B>>): Promise<R | null> {
    let endpoint = method.endpoint;

    // Replace path params
    if (setup.params) for (const key in setup.params)
        endpoint.replace(':' + key, String(setup.params[key]));

    // Create request URL object
    const request = new URL(endpoint);

    // Check that all path parameters are filled in
    if (request.pathname.includes(':')) {
        const parts = request.pathname.split('/');
        const params: string[] = [];
        for (const part of parts) {
            if (part.startsWith(':'))
                params.push(part.substring(1));
        }
        throw new ParamsError(params);
    }

    // Check query parameters
    if (setup.query) for (const key in setup.query)
        request.searchParams.set(key, String(setup.query[key]));

    // Generate init object
    const initObj = Object.assign({}, {
        method: method.method,
        body: setup.body ? JSON.stringify(setup.body) : undefined
    }, setup.options ?? {});

    let response: Response;
    try {
        response = await fetch(request, initObj);

        const data = await response.json();
        if (response.ok) {

            // Check for response handler
            if (method.handlers?.onResponse)
                return method.handlers.onResponse(data);
            else return data;
        } else {

            // Check for error handler
            if (method.handlers?.onError)
                return method.handlers?.onError(response.status, data);
            return data;
        }
    } catch (e) {
        console.warn(e);

        if (method.handlers?.onError)
            return method.handlers?.onError(0, null);
        else return null;
    }
}
