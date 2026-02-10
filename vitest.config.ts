import { defineConfig } from "vitest/config";
import path from "path";

const projectRoot = path.resolve(__dirname, "./");

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
      "server-only": path.resolve(
        projectRoot,
        "./src/test/__mocks__/server-only.ts",
      ),
    },
  },
  test: {
    dir: "src/test/",
    environment: "jsdom", // components; integration tests can override to 'node'
    // setupFiles: ['./tests/vitest/setupTests.ts'],
    // coverage: { provider: 'vs8', reporter: ['text', 'lcov'] }
  },
});
