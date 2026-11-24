import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { assertMockEnvironment, previewHeaders } from './config/preview';
import { previewAssets } from './config/preview-assets';
export default defineConfig(({ mode }) => {
  assertMockEnvironment(loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), 'VITE_'));
  return {
    plugins: [react(), previewAssets()],
    preview: { host: '127.0.0.1', headers: previewHeaders },
    build: { sourcemap: false, chunkSizeWarningLimit: 1000 },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      clearMocks: true,
      fileParallelism: false,
      testTimeout: 15000,
    },
  };
});
