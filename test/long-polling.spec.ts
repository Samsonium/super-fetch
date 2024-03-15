/// <reference path="global.d.ts" />
import { describe, test, afterEach, expect, Mock, beforeEach } from 'vitest';
import sf from '../src';

// Declare mocked fetch
declare const fetch: Mock<[URL, RequestInit?], Promise<Response>>;

beforeEach(() => {
    fetch.mockReset();
});

describe('Long-polling', () => {
    test('Long-polling works', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));

        const lp = new sf.LongPolling();
    });

    test('Long-polling width URL', async () => {
        fetch.mockResolvedValue(createResponse(200, 'OK', []));


    });
});
