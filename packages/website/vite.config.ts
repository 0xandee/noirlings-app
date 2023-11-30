import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  build: {
    lib: {
      entry: "index.html",
      formats: ["cjs", "es"],
      fileName: "index",
    },
  },
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
});
