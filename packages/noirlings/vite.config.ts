import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';

export default defineConfig(({ mode }: { mode: string }) => {
  console.log("Building in mode:", mode);
  const isVercel = process.env.VERCEL === "1" || mode === "vercel";

  const base = {
    // Disable optimization for Vercel builds to save memory
    ...(isVercel ? {} : {
      optimizeDeps: {
        include: ['buffer'],
        exclude: [
          "@noir-lang/noir_wasm",
          "@noir-lang/backend_barretenberg",
          "@noir-lang/noir_js",
          "@noir-lang/types"
        ],
        esbuildOptions: {
          target: "esnext",
        },
      },
    }),
    build: {
      target: "esnext",
      // Memory optimization for Vercel builds
      ...(isVercel ? {
        outDir: "../../dist",
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
          output: {
            // Ultra-aggressive chunking to reduce memory per chunk
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // Split each major dependency into its own chunk
                if (id.includes('@noir-lang/noir_wasm')) return 'noir-wasm';
                if (id.includes('@noir-lang/noir_js')) return 'noir-js';  
                if (id.includes('@noir-lang/backend_barretenberg')) return 'noir-backend';
                if (id.includes('monaco-editor/esm/vs/editor')) return 'monaco-editor';
                if (id.includes('monaco-editor/esm/vs/language')) return 'monaco-language';
                if (id.includes('monaco-editor')) return 'monaco-core';
                if (id.includes('react-dom')) return 'react-dom';
                if (id.includes('react')) return 'react';
                return 'vendor';
              }
            },
            // Reduce chunk size to minimize memory per build step
            maxParallelFileOps: 1, // Process one file at a time
            chunkFileNames: '[name]-[hash].js'
          }
        }
      } : {
        lib: {
          entry: path.resolve("src/index.tsx"),
          name: "Noir Playground",
          formats: ["es"] as LibraryFormats[],
          fileName: "index",
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
            intro: "import './style.css';",
          },
        },
      }),
    },
    plugins: [
      react(),
      // Only generate TypeScript declarations for non-Vercel builds to save memory
      ...(isVercel ? [] : [dts({
        insertTypesEntry: true,
      })]),
      // Use minimal polyfills for Vercel builds
      nodePolyfills({
        include: isVercel ? ['buffer'] : ['buffer', 'process'],
        globals: {
          Buffer: true,
          global: true,
          process: !isVercel,
        },
      }),
    ],
    define: {
      global: 'globalThis',
    },
    envPrefix: ['VITE_'],
    server: {
      proxy: {
        "/api": "http://localhost:5173",
      },
    },
  };

  if (mode === "development") {
    return {
      ...base,
      build: {
        ...base.build,
        minify: false,
      },
    };
  } else {
    return {
      ...base,
      build: {
        ...base.build,
        minify: true,
      },
    };
  }
});