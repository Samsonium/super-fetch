/// <reference path="global.d.ts" />
import { describe, test, expect, beforeEach, Mock } from 'vitest';
import sf, { ApiRecord } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

const api = sf.groupApi('https://api.example.com', {

    vehicles: {
        list: {
            endpoint: '/list',
            method: 'GET'
        } as ApiRecord<{
            page: number;
            per_page: number;
        }, null, {
            data: {
                items: {
                    id: string;
                    license: string;
                }[]
            }
        }>,

        view: {
            endpoint: '/view/:id',
            method: 'GET'
        } as ApiRecord<null, { id: string }, {
            ok: boolean;
            data: {
                id: string;
                license: string;
            }
        }>
    }
}, {
    headers: {
        'Authorization': 'Bearer 123',
        'Accept': 'application/json'
    }
});

beforeEach(() => {
    fetch.mockReset();
})

describe('groupApi::GET', () => {
    test('Member is callable', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {data:{items:[]}}));

        const res = await api.vehicles.list({
            query: {
                page: 0,
                per_page: 10
            }
        });

        const checkURL = new URL('https://api.example.com/list?page=0&per_page=10');
        expect(fetch).toHaveBeenCalledWith(checkURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 123',
                'Accept': 'application/json'
            }
        });

        expect(res.ok).toBe(true);
        expect(res.statusCode).toBe(200);
        expect(res.statusText).toBe('OK');
        expect(res.data).toStrictEqual({data:{items:[]}});
    });

    test('Path params works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {data:{items:[]}}));

        const res = await api.vehicles.view({
            path: {
                id: 'uuid'
            }
        });

        const checkURL = new URL('https://api.example.com/view/uuid');
        expect(fetch).toHaveBeenCalledWith(checkURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 123',
                'Accept': 'application/json'
            }
        });

        expect(res.ok).toBe(true);
    });

    test('Options are rewritable', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {data:{items:[]}}));

        const res = await api.vehicles.view({
            path: {
                id: '12345'
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html'
            }
        });

        const checkURL = new URL('https://api.example.com/view/12345');
        expect(fetch).toHaveBeenCalledWith(checkURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 123',
                'Content-Type': 'application/json',
                'Accept': 'text/html'
            }
        });

        expect(res.ok).toBe(true);
    });
});
