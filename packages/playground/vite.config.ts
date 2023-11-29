import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ mode }) => {
  console.log("Building in mode:", mode);
  const base = {
    build: {
      target: "esnext",
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: path.resolve("src/index.ts"),
        name: "Noir Playground",
        formats: ["es", "cjs"],
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
