import { Mock } from 'vitest';

declare global {

    /** Fetch function */
    type FMock = Mock<['input', 'init'], Promise<Response>>;

    /** Create mocked response */
    function createResponse(code: number, text: string, data: Record<string, any>): Response;
}

export {};
