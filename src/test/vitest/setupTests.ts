import { afterEach, vi, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Clean the DOM after each test
afterEach(() => cleanup());

// Mock next/image to a plain <img />
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Router helpers (use sparingly)
// If you need specific exports, next-router-mock re-exports them
vi.mock('next/navigation', async () => {
  const mod = await import('next-router-mock');
  return { ...mod };
});
