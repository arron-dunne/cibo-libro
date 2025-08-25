import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',         // components; integration tests can override to 'node'
    setupFiles: ['./tests/setupTests.ts'],
    coverage: { provider: 'vs8', reporter: ['text', 'lcov'] }
  }
});
