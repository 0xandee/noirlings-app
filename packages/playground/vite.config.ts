import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';

export default defineConfig(({ mode }: { mode: string }) => {
  console.log("Building in mode:", mode);
  const isVercel = process.env.VERCEL === "1";

  const base = {
    optimizeDeps: {
      exclude: [
        "@noir-lang/noir_wasm",
        "@noir-lang/backend_barretenberg", 
        "@noir-lang/noir_js",
        "@noir-lang/types",
        "@noir-lang/acvm_js",
        "@noir-lang/noirc_abi"
      ],
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      target: "esnext",
      // If we're building for Vercel, disable library mode and use the default dist directory
      ...(isVercel ? {
        outDir: "dist",
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
      nodePolyfills({ globals: { Buffer: true } }),
      dts({
        insertTypesEntry: true,
      }),
      // Custom plugin to serve WASM files correctly
      {
        name: 'wasm-loader',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.includes('noirc_abi_wasm_bg.wasm')) {
              const wasmPath = path.resolve(__dirname, '../../node_modules/@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm');
              if (fs.existsSync(wasmPath)) {
                res.setHeader('Content-Type', 'application/wasm');
                res.end(fs.readFileSync(wasmPath));
                return;
              }
            }
            if (req.url?.includes('acvm_js_bg.wasm')) {
              const wasmPath = path.resolve(__dirname, '../../node_modules/@noir-lang/acvm_js/web/acvm_js_bg.wasm');
              if (fs.existsSync(wasmPath)) {
                res.setHeader('Content-Type', 'application/wasm');
                res.end(fs.readFileSync(wasmPath));
                return;
              }
            }
            next();
          });
        }
      }
    ],
    server: {
      proxy: {
        "/api": "http://localhost:5173",
      },
      fs: {
        allow: [
          '.', 
          '..',
          '../../',
          '../../node_modules',
          '/Users/0xandee/Documents/Github/noirlings-app/node_modules'
        ]
      },
    },
    assetsInclude: ['**/*.wasm'],
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
