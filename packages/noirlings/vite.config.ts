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
    build: {
      target: "esnext",
      // Memory optimization for Vercel builds
      ...(isVercel ? {
        outDir: "../../dist",
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              noir: ['@noir-lang/noir_wasm', '@noir-lang/noir_js']
            }
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
      dts({
        insertTypesEntry: true,
      }),
      nodePolyfills({
        // Enable specific polyfills needed for Supabase client
        include: ['buffer', 'process', 'util', 'stream', 'events', 'url', 'querystring'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    define: {
      global: 'globalThis',
      'process.env': {},
      // Add additional global definitions for Supabase compatibility
      __SUPABASE_CLIENT_DEBUG__: false,
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