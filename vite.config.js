import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so `npm run build` output in dist/ works from any static host or subfolder
  // (GitHub Pages, Vercel, Netlify, or `npm run preview`).
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Phaser is a single large dependency; silence the default 500 kB warning.
    chunkSizeWarningLimit: 2000,
  },
});
