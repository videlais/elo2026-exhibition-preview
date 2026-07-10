/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const rawBasePath = process.env.VITE_APP_BASE_PATH || '/mediaartsexhibits/elo2026/';
const normalizedBasePath = rawBasePath.endsWith('/') ? rawBasePath : `${rawBasePath}/`;

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), svgr()],
  base: normalizedBasePath,
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: isSsrBuild ? 'dist-ssr' : 'build',
    sourcemap: false
  },
  ssr: {
    // Bundle all dependencies into the SSR output so Node.js ESM doesn't have to
    // resolve packages that lack proper package exports (e.g. react-bootstrap).
    noExternal: isSsrBuild ? true : undefined,
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['tests/**', 'src/vite-env.d.ts', 'src/global.d.ts', 'src/types/modules.d.ts', 'src/index.tsx']
    }
  }
}));
