import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';

export default defineConfig(({ mode }: { mode: string }) => {
  console.log("Building in mode:", mode);
  const isVercel = process.env.VERCEL === "1" || mode === "vercel";
  const isNetlify = process.env.NETLIFY === "true" || mode === "netlify";
  const isRailway = process.env.RAILWAY_ENVIRONMENT || mode === "railway";

  const base = {
    // Disable optimization for deployment builds to save memory
    ...((isVercel || isNetlify || isRailway) ? {} : {
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
      // Memory optimization for deployment builds
      ...((isVercel || isNetlify || isRailway) ? {
        outDir: "../../dist",
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'esbuild',
        // Add esbuild options for Railway to handle TypeScript more leniently
        ...(isRailway ? {
          esbuild: {
            logOverride: { 'this-is-undefined-in-esm': 'silent' }
          }
        } : {}),
        rollupOptions: {
          // Suppress warnings for Railway builds
          ...(isRailway ? { onwarn: () => {} } : {}),
          output: {
            // Ultra-aggressive chunking to reduce memory per chunk
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                // Less aggressive chunking to avoid module initialization issues
                if (id.includes('@noir-lang')) return 'noir';
                if (id.includes('monaco-editor')) return 'monaco';
                if (id.includes('react')) return 'react-vendor';
                return 'vendor';
              }
            },
            // Reduce chunk size to minimize memory per build step
            maxParallelFileOps: 1, // Process one file at a time
            chunkFileNames: '[name]-[hash].js',
            // Ensure proper module loading order
            inlineDynamicImports: false
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
      // Disable TypeScript declarations for deployment builds to save memory and avoid strict type checking
      ...((isVercel || isNetlify || isRailway) ? [] : [dts({
        insertTypesEntry: true,
      })]),
      // Use minimal polyfills for deployment builds
      nodePolyfills({
        include: (isVercel || isNetlify || isRailway) ? ['buffer'] : ['buffer', 'process'],
        globals: {
          Buffer: true,
          global: false, // Disable global polyfill to avoid globalThis export issues
          process: !(isVercel || isNetlify || isRailway),
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