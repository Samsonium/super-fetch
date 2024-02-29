import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // browser: {
        //     enabled: true,
        //     name: 'chrome'
        // },
        include: ['test/*.spec.ts'],
        exclude: ['**/node_modules/**'],
        environment: 'jsdom',
        setupFiles: ['test/setup.ts']
    }
})