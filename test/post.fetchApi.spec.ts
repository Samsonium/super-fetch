/// <reference path="global.d.ts" />
import { describe, test, afterEach, expect, Mock } from 'vitest';
import { ApiRecord, fetchApi } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

/** API repository */
const apiRepo = {
    simplePOST: {
        endpoint: 'https://some.api',
        method: 'POST'
    } as ApiRecord<null, null, null, null, {hello: 'world'}>,

    postWithAuth: {
        endpoint: 'https://some.api',
        method: 'POST'
    } as ApiRecord,

    postWithExtras: {
        endpoint: 'https://some.api',
        method: 'POST'
    } as ApiRecord,

    postWithNonJSON: {
        endpoint: 'https://some.api',
        method: 'POST'
    } as ApiRecord<null, null, null, null, string>
};

afterEach(() => {
    fetch.mockReset();
});

describe('Fetch API::POST', () => {
    test('Simple POST', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {}));

        const res = await fetchApi(apiRepo.simplePOST, {
            body: {
                hello: 'world'
            }
        });

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.simplePOST.endpoint), {
            body: JSON.stringify({hello: 'world'}),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        expect(res.ok).toBe(true);
    });

    test('POST with auth', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {}));

        const token = 'someTokenValue';
        const res = await fetchApi(apiRepo.postWithAuth, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.postWithAuth.endpoint), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        expect(res.ok).toBe(true);
    });

    test('POST with extras', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {}));

        const res = await fetchApi(apiRepo.postWithExtras, {
            extra: {
                mode: 'cors'
            }
        });

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.postWithExtras.endpoint), {
            method: 'POST',
            mode: 'cors'
        });
        expect(res.ok).toBe(true);
    });

    test('POST with non-JSON value', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {}));

        const res = await fetchApi(apiRepo.postWithNonJSON, {
            body: 'HELLOWORLD'
        });

        expect(fetch).toHaveBeenCalledWith(new URL(apiRepo.postWithNonJSON.endpoint), {
            method: 'POST',
            body: 'HELLOWORLD'
        });
        expect(res.ok).toBe(true);
    });
});
