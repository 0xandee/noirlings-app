import tmLanguage from "../syntax/noir.tmLanguage.json";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";

import initNoirWasm from "@noir-lang/noir_wasm";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import { loadWASM } from "onigasm";
import loader from "@monaco-editor/loader";
import lightTheme from "../syntax/lightTheme.json";
import { useEffect, useState } from "react";

export const useMonaco = () => {
  const [monaco, setMonaco] = useState<typeof import("monaco-editor")>();
  const [loaded, setLoaded] = useState(false);
  const [promises, setPromises] = useState<Promise<unknown>[]>([]);

  useEffect(() => {
    if (promises.length) return;

    const promArray = [];
    promArray.push(
      loadWASM(new URL("onigasm/lib/onigasm.wasm", import.meta.url).toString()),
    );
    promArray.push(
      initNoirWasm(
        new URL(
          "@noir-lang/noir_wasm/web/noir_wasm_bg.wasm",
          import.meta.url,
        ).toString(),
      ),
    );
    promArray.push(
      initNoirC(
        new URL(
          "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
          import.meta.url,
        ).toString(),
      ),
    );
    promArray.push(
      initACVM(
        new URL(
          "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
          import.meta.url,
        ).toString(),
      ),
    );
    promArray.push(
      loader.init().then((monaco) => {
        setMonaco(monaco);
      }),
    );
    setPromises(promArray);
  }, [promises]);

  useEffect(() => {
    if (!monaco || loaded || !promises) return;

    monaco.editor.defineTheme("noirLight", {
      base: "vs",
      inherit: true,
      colors: lightTheme.colors,
      rules: lightTheme.rules,
    });
    monaco.languages.register({ id: "noir" });
    monaco.editor.setTheme("noirLight");
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

    Promise.all([...promises, wireTmGrammars(monaco, registry, grammars)]).then(
      () => setLoaded(true),
    );
  }, [monaco, promises]);

  return { monaco, loaded };
};
