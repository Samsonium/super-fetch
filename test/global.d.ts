import { Mock } from 'vitest';

declare global {
    /** Create mocked response */
    function createResponse(code: number, text: string, data: Record<string, any>): Response;
}

export {};
