import React, { useRef } from "react";
import { EditorContainer, TitleBox } from "./NoirEditor.styles";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { loadGrammar } from "../../hooks/loadGrammar";
import { decodeSnippet } from "../../utils/shareSnippet";
import examples from "../../syntax/examples.json";
import { ActionsBox } from "../actionsBox/actions";
import { NoirEditorProps } from "../../types";
import { ProofData } from "@noir-lang/types";
import { ResultBox } from "../resultBox/result";
import { StyledHeader } from "../../globals/text.styles";
import { editor } from "monaco-editor";

function NoirEditor(props: NoirEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [monacoEditor, setMonacoEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null); // To track the editor instance
  const [code, setCode] = useState<string | undefined>();
  const [proof, setProof] = useState<ProofData | null>(null);

  useEffect(() => {
    console.log(props.initialCode);
    const code = decodeSnippet({
      encoded: props.initialCode || examples.default,
    });
    setCode(code);

    async function load() {
      const monaco = await loadGrammar();
      if (editorRef.current && !monacoEditor) {
        if (editorRef.current.hasChildNodes())
          editorRef.current.removeChild(editorRef.current.firstChild!);

        const monacoProperties = {
          value: code,
          fontSize: 18,
          language: "noir",
          roundedSelection: false,
          scrollBeyondLastLine: false,
        };
        console.log(monacoProperties);
        const editor = monaco.editor.create(
          editorRef.current!,
          monacoProperties,
        );

        setMonacoEditor(editor);
      }
    }

    load();

    // if (editor) editor.getModel().onDidChangeContent(() => {});
  }, []);

  useEffect(() => {
    if (monacoEditor)
      monacoEditor.getModel()?.onDidChangeContent(() => {
        setCode(monacoEditor.getValue());
      });
  }, [monacoEditor]);

  useEffect(() => {
    console.log(code);
  }, [code, props]);

  return (
    <EditorContainer ref={containerRef}>
      <ToastContainer />
      <TitleBox>
        <StyledHeader>Noir Playground</StyledHeader>
      </TitleBox>
      <div ref={editorRef} style={{ width: "100%", height: "400px" }}></div>
      {!proof && code && (
        <ActionsBox code={code} props={props} setProof={setProof} />
      )}
      {proof && <ResultBox proof={proof} setProof={setProof} />}
    </EditorContainer>
  );
}

export default NoirEditor;
