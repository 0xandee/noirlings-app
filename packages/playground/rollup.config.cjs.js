import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import { wasm } from "@rollup/plugin-wasm";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist/cjs",
    format: "cjs",
  },
  plugins: [
    typescript({ compilerOptions: { outDir: "dist/cjs" } }),
    json(),
    wasm(),
    copy({
      targets: [
        { src: "src/**/*.nr", dest: "dist/cjs" },
        { src: "src/**/*.wasm", dest: "dist/cjs" },
      ],
    }),
  ],
};
