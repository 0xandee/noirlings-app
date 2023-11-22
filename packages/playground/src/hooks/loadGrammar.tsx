import tmLanguage from "../syntax/noir.tmLanguage.json";
import React from "react";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";

import initNoirWasm from "@noir-lang/noir_wasm";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import { loadWASM } from "onigasm";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export const LoadGrammar = ({ children }: { children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => await loadGrammar())();
    setLoaded(true);
  }, []);
  if (loaded) return <>{children}</>;
};

async function loadGrammar() {
  loader.config({ monaco });
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

  console.log("loading grammar");
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
  monaco.languages.register({ id: "noir" });
  await wireTmGrammars(monaco, registry, grammars);
}
