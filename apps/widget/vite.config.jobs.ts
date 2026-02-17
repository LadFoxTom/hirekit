import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/jobs/main.ts',
      name: 'HireKitJobs',
      fileName: (format) => `hirekit-jobs.${format}.js`,
      formats: ['iife'],
    },
    outDir: 'dist-jobs',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
  },
});
