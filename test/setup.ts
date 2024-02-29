import { vi } from 'vitest';

// Mock Fetch API
global.fetch = vi.fn();

// Implement function
global.createResponse = (code, text, data) => {
    return new Response(JSON.stringify(data), {
        status: code,
        statusText: text
    });
};
