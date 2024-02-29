import {describe, test, afterEach, expect, Mock} from 'vitest';
import { ApiRecord, fetchApi } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[RequestInfo, RequestInit?], Promise<Response>>;

/** API repository */
const apiRepo = {
    simpleGET: {
        method: 'GET',
        endpoint: 'https://some-api.com'
    } as ApiRecord<null, null, {hello: 'world'}>,

    getWithQuery: {
        method: 'GET',
        endpoint: 'https://some-api.com'
    } as ApiRecord<{page: number}, null, {items: any[]}>,

    getWithParams: {
        method: 'GET',
        endpoint: 'https://some-api.com/:id'
    } as ApiRecord<null, {id: number}, {hello: 'world'}, {}>,
};

afterEach(() => {
    fetch.mockReset();
});

describe('Fetch API::GET', () => {
    test('Simple GET', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK',{hello: 'world'}));

        const res = await fetchApi(apiRepo.simpleGET);

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.simpleGET.endpoint), {method: 'GET'});

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(200);
        expect(res.statusText).toBe('OK');
        expect(res.data).toStrictEqual({hello: 'world'});
    });

    test('GET with query parameters', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK',{items: []}));

        const res = await fetchApi(apiRepo.getWithQuery, {
            query: {
                page: 1
            }
        });

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.getWithQuery.endpoint + '?page=1'), {method: 'GET'});

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(200);
        expect(res.statusText).toBe('OK');
        expect(res.data).toStrictEqual({items: []});
    });

    test('GET with path parameters', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK',{hello: 'world'}));

        const res = await fetchApi(apiRepo.getWithParams, {
            path: {
                id: 0
            }
        });

        const checkURL = new URL(apiRepo.getWithParams.endpoint.replace(':id', String(0)));
        expect(fetch).toHaveBeenCalledWith(checkURL, {method: 'GET'});
    });

    test('GET without params for templated endpoint', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK',{hello: 'world'}));

        await expect(() => fetchApi(apiRepo.getWithParams))
            .rejects.toThrowError(/The endpoint contains variables/);
    });

    test('GET without required params', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK',{hello: 'world'}));

        // @ts-ignore
        await expect(() => fetchApi(apiRepo.getWithParams, {path: {}}))
            .rejects.toThrowError(/The following fields is missing \(1\)/);
    });
});
