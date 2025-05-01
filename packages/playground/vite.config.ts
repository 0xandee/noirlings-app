import react from "@vitejs/plugin-react";
import { LibraryFormats, defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ mode }: { mode: string }) => {
  console.log("Building in mode:", mode);
  const base = {
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      target: "esnext",
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: path.resolve("src/index.tsx"),
        name: "Noir Playground",
        formats: ["es"] as LibraryFormats[],
        // the proper extensions will be added
        fileName: "index",
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          intro: "import './style.css';",
        },
      },
    },
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    server: {
      proxy: {
        "/api": "http://localhost:3000",
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
