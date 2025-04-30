import themes from "../themes/index";
import tmLanguage from "../syntax/noir.tmLanguage.json";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import { loadWASM } from "onigasm";
import { useEffect, useState } from "react";

import { loader } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js?worker&inline";

self.MonacoEnvironment = {
  getWorker(_, label) {
    console.log(label);
    return new editorWorker();
  },
};

loader.config({ monaco: monacoEditor });

export const useMonaco = (theme: 'light' | 'dark' = 'light') => {
  const [monaco, setMonaco] = useState<typeof import("monaco-editor")>();
  const [loaded, setLoaded] = useState(false);
  const [promises, setPromises] = useState<Promise<unknown>[]>([]);

  useEffect(() => {
    if (promises.length) return;

    const promArray = [];
    promArray.push(
      loadWASM(
        new URL("onigasm/lib/onigasm.wasm", import.meta.url).toString()
      ).catch((error) => {
        if (
          error.message !==
          "Onigasm#init has been called and was succesful, subsequent calls are not allowed once initialized"
        ) {
          // If it's not the specific error we're expecting, rethrow it
          throw error;
        }
        // Otherwise, ignore the error as onigasm is already initialized
        console.log("Onigasm already initialized, skipping re-initialization.");
      })
    );
    promArray.push(
      initNoirC(
        new URL(
          "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
          import.meta.url
        ).toString()
      )
    );
    promArray.push(
      initACVM(
        new URL(
          "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
          import.meta.url
        ).toString()
      )
    );
    promArray.push(
      loader.init().then((monaco) => {
        const { darkTheme, lightTheme } = themes;
        monaco.editor.defineTheme(
          "dark",
          darkTheme as monacoEditor.editor.IStandaloneThemeData
        );
        monaco.editor.defineTheme(
          "light",
          lightTheme as monacoEditor.editor.IStandaloneThemeData
        );
        monaco.languages.register({ id: "noir" });
        setMonaco(monaco);
      })
    );
    setPromises(promArray);
  }, [promises]);

  useEffect(() => {
    if (!monaco || !promises) return;

    monaco.editor.setTheme(theme);

    if (loaded) return;

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
    console.log("editor loaded");

    Promise.all([...promises]).then(() => {
      wireTmGrammars(monaco, registry, grammars);
      setLoaded(true);
    });
  }, [monaco, promises, theme, loaded]);

  return { monaco, loaded };
};
