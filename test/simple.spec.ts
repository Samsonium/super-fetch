/// <reference path="global.d.ts" />
import { describe, test, expect, beforeEach, Mock } from 'vitest';
import sf from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

beforeEach(() => {
    fetch.mockReset();
})

describe('Simple API', () => {
    test('Request works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {ok: true}));

        const res = await sf.get('https://some.api');

        expect(fetch).toHaveBeenCalledWith(new URL('https://some.api'), {
            method: 'GET'
        });

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(200);
        expect(await res.json()).toStrictEqual({ok: true});
    });

    test('Request can return json and text both', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {ok: true}));

        const res = await sf.get('https://some.api');

        expect(fetch).toHaveBeenCalledWith(new URL('https://some.api'), {
            method: 'GET'
        });

        expect(await res.json()).toStrictEqual({ok: true});
        expect(await res.text()).toBe('{"ok":true}');
    });

    test('Parallel requests works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {ok: true}));

        const res = await sf.parallel([
            sf.get('https://one.get.com'),
            sf.get('https://two.get.com'),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(1, new URL('https://one.get.com'), {
            method: 'GET'
        });
        expect(fetch).toHaveBeenNthCalledWith(2, new URL('https://two.get.com'), {
            method: 'GET'
        });

        expect(res[0].ok).toBe(true);
        expect(res[1].ok).toBe(true);

        expect(res[0].statusCode).toBe(200);
        expect(res[1].statusCode).toBe(200);

        expect(await res[0].json()).toStrictEqual({ok: true});
        expect(await res[1].text()).toBe('');
    });
});
