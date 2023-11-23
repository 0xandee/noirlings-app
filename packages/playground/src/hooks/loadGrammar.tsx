import tmLanguage from "../syntax/noir.tmLanguage.json";
import React, { ReactElement } from "react";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";

import initNoirWasm from "@noir-lang/noir_wasm";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import { loadWASM } from "onigasm";
import * as monaco from "monaco-editor";
import loader from "@monaco-editor/loader";
import { useEffect, useState } from "react";
import lightTheme from "../syntax/lightTheme.json";

// export const LoadGrammar = ({ children }: { children: React.ReactNode }) => {

//   if (!grammar) return <div>Loading...</div>; // Or some loading indicator

//   // Assuming children is a single React element
//   return <>{children}</>;
// };

export async function loadGrammar() {
  await loadWASM(new URL("./onigasm.wasm", import.meta.url).toString()); // You can also pass ArrayBuffer of onigasm.wasm file
  await initNoirWasm(
    new URL(
      "@noir-lang/noir_wasm/web/noir_wasm_bg.wasm",
      import.meta.url,
    ).toString(),
  );
  await initNoirC(
    new URL(
      "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
      import.meta.url,
    ).toString(),
  );
  await initACVM(
    new URL(
      "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
      import.meta.url,
    ).toString(),
  );

  // Create a registry that can create a grammar from a scope name.
  const registry = new Registry({
    getGrammarDefinition: async () => {
      return {
        format: "json", // can also be `plist`
        content: tmLanguage, // when format is 'json', parsed JSON also works
      };
    },
  });

  const grammars = new Map();
  grammars.set("noir", "main.nr");

  const monaco = await loader.init();

  monaco.editor.defineTheme("noirLight", {
    base: "vs",
    inherit: true,
    colors: lightTheme.colors,
    rules: lightTheme.rules,
  });
  monaco.languages.register({ id: "noir" });

  monaco.editor.setTheme("noirLight");
  await wireTmGrammars(monaco, registry, grammars);
  return monaco;
}
