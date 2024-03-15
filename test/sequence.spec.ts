/// <reference path="global.d.ts" />
import { describe, test, expect, beforeEach, Mock } from 'vitest';
import sf, { ApiRecord } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

const apiRepo = {
    simpleGET: {
        method: 'GET',
        endpoint: 'https://example.com/'
    } as ApiRecord<{
        page: number;
        per_page: number;
    }, null, {
        items: string[]
    }>
};

beforeEach(() => {
    fetch.mockReset();
});

describe('Sequence', () => {
    test('Request works', async () => {
        const seq = new sf.Sequence(apiRepo.simpleGET);

        fetch.mockResolvedValue(createResponse(200, 'OK', {items: ['hello']}));
        await seq.call();
        expect(seq.read()?.data).toStrictEqual({items: ['hello']});

        fetch.mockResolvedValue(createResponse(200, 'OK', {items: ['!']}));
        await seq.call();
        expect(seq.read()?.data).toStrictEqual({items: ['!']});
    });

    test('Sequence.read returns last data', async () => {
        const seq = new sf.Sequence(apiRepo.simpleGET);

        fetch.mockResolvedValue(createResponse(200, 'OK', {items: ['hello']}));
        await seq.call();
        expect(seq.read()?.data).toStrictEqual({items: ['hello']});

        fetch.mockReturnValue(new Promise(r => {
            setTimeout(() => {
                r(createResponse(200, 'OK', {items: ['world']}));
            }, 1000);
        }));
        seq.call().then();
        expect(seq.read()?.data).toStrictEqual({items: ['hello']});

        fetch.mockResolvedValue(createResponse(200, 'OK', {items: ['!']}));
        seq.call().then();
        await new Promise(r => setTimeout(r, 1500));

        expect(seq.read()?.data).toStrictEqual({items: ['!']});
    });
});
