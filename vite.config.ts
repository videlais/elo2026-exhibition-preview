/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const rawBasePath = process.env.VITE_APP_BASE_PATH || '/';
const normalizedBasePath = rawBasePath.endsWith('/') ? rawBasePath : `${rawBasePath}/`;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
    // Bundle all dependencies into the SSR output so Node.js ESM doesn't have
    // to resolve packages that lack proper package exports (e.g. react-bootstrap)
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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['tests/**', 'src/**/*.stories.tsx', 'src/vite-env.d.ts', 'src/global.d.ts', 'src/types/modules.d.ts', 'src/index.tsx']
    },
    projects: [{
      extends: true,
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts']
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
}));