import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ mode }: { mode: string }) => {
  console.log("Building in mode:", mode);
  const isVercel = process.env.VERCEL === "1";

  const base = {
    optimizeDeps: {
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
      dts({
        insertTypesEntry: true,
      }),
    ],
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
