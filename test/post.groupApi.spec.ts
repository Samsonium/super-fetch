/// <reference path="global.d.ts" />
import { describe, test, expect, beforeEach, Mock } from 'vitest';
import sf, { ApiRecord } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

const api = sf.groupApi('https://api.example.com', {

    vehicles: {
        new: {
            endpoint: '/new',
            method: 'POST'
        } as ApiRecord<null, null, {
            ok: true;
        }, null, {
            license: string;
        }>,

        edit: {
            endpoint: '/edit/:id',
            method: 'POST'
        } as ApiRecord<null, { id: string }, {
            ok: true;
        }, null, {
            license: string;
        }>
    }
});

beforeEach(() => {
    fetch.mockReset();
})

describe('groupApi::POST', () => {
    test('POST successfully finished', async () => {
        fetch.mockResolvedValue(createResponse(201, 'Created', {ok: true}));

        const res = await api.vehicles.new({
            body: {
                license: '123'
            }
        });

        const checkURL = new URL('https://api.example.com/new');
        expect(fetch).toHaveBeenCalledWith(checkURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({license: '123'})
        });

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(201);
        expect(res.statusText).toBe('Created');
        expect(res.data).toStrictEqual({ok: true});
    });

    test('POST with params works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {ok: true}));

        const res = await api.vehicles.edit({
            path: {
                id: 'uuid'
            },
            body: {
                license: '321'
            }
        });

        const checkURL = new URL('https://api.example.com/edit/uuid');
        expect(fetch).toHaveBeenCalledWith(checkURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({license: '321'})
        });

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(200);
    });
});
