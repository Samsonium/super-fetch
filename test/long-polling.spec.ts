/// <reference path="global.d.ts" />
import { describe, test, expect, Mock, beforeEach } from 'vitest';
import sf, { ApiRecord } from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

beforeEach(() => {
    fetch.mockReset();
});

describe('Long-polling', () => {
    test('Starts automatically', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const handler = () => false;
        new sf.LongPolling('https://example.com/', handler);

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalled();
    });

    test('Doesn\'t start if `autoStart == false`', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const handler = () => true;
        new sf.LongPolling('https://ab.cd/e', handler, {
            autoStart: false
        });

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).not.toHaveBeenCalled();
    });

    test('Starts with manual starting', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const handler = () => false;
        const lp = new sf.LongPolling('https://ab.cd/e', handler, {
            autoStart: false
        });

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).not.toHaveBeenCalled();

        lp.start();
        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalled();
    });

    test('Doesn\'t continue if handler returns `false`', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const handler = () => false;
        new sf.LongPolling('https://ab.cd/e', handler);

        await new Promise(r => setTimeout(r, 2000));
        expect(fetch).toHaveBeenCalledOnce();
    });

    test('Long-polling with string url', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {a: 'b'}));

        const handler = () => false;
        const url = 'https://api.some.com/some/method';
        new sf.LongPolling(url, handler);

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalledWith(new URL(url), {
            method: 'GET'
        });
    });

    test('Long-polling with URL instance', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {a: 'b'}));

        const handler = () => false;
        const url = new URL('https://api.some.com/some/method');
        new sf.LongPolling(url, handler);

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalledWith(url, {
            method: 'GET'
        });
    });

    test('Long-polling with ApiRecord', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', {a: 'b'}));

        const handler = () => false;
        const endpoint = 'https://api.some.com/some/method';
        const apiRecord = {
            endpoint,
            method: 'POST'
        } as ApiRecord;
        new sf.LongPolling(apiRecord, handler);

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalledWith(new URL(endpoint), {
            method: 'POST'
        });
    });

    test('`.stop()` works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const handler = () => false;
        const lp = new sf.LongPolling('https://ab.cd/e', handler);

        await new Promise(r => setTimeout(r, 50));
        expect(fetch).toHaveBeenCalledOnce();
        lp.stop();

        await new Promise(r => setTimeout(r, 1200));
        expect(fetch).toHaveBeenCalledOnce();
    });

    test('Delay works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        let counter = 0;
        const handler = () => {
            counter++;
            return true;
        };
        const lp = new sf.LongPolling('https://ab.cd/e', handler, {
            delay: 100
        });

        await new Promise(r => setTimeout(r, 300));
        expect(fetch).toHaveBeenCalledTimes(3);

        lp.stop();
    });
});
