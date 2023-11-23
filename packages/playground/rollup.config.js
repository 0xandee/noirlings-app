import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";
import { wasm } from "@rollup/plugin-wasm";
import { terser } from "rollup-plugin-terser";

const base = {
  input: "src/index.ts",
  plugins: [json(), wasm()],
};

const cjs = {
  ...base,
  output: [
    {
      dir: "dist/cjs",
      format: "cjs",
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      declaration: true,
      declarationDir: "dist/cjs",
    }),
    copy({
      targets: [{ src: "src/**/*.wasm", dest: "dist/cjs" }],
    }),
  ],
};

const esm = {
  ...base,
  output: [
    {
      dir: "dist/esm",
      format: "esm",
    },
  ],
  plugins: [
    ...base.plugins,
    typescript({
      declaration: true,
      declarationDir: "dist/esm",
    }),
    copy({
      targets: [{ src: "src/**/*.wasm", dest: "dist/esm" }],
    }),
  ],
};

// add terser at the end of the plugins array
[esm, cjs].forEach((config) => {
  config.plugins.push(terser());
});

console.log(esm);

export default [cjs, esm];
