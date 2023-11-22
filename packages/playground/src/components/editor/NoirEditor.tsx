import React from "react";
import Editor from "@monaco-editor/react";
import { EditorContainer } from "./NoirEditor.styles";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { LoadGrammar } from "../../hooks/loadGrammar";
import { decodeSnippet } from "../../utils/shareSnippet";
import examples from "../../syntax/examples.json";
import { ActionsBox } from "../actionsBox/actions";
import { NoirEditorProps } from "../../types";

function NoirEditor(props: NoirEditorProps) {
  const [code, setCode] = useState<string | undefined>();

  useEffect(() => {
    if (!code) {
      const code = decodeSnippet({
        encoded: props.initialCode || examples.default,
      });
      setCode(code);
    }
  }, [code, props.initialCode]);

  if (!code) return <div>Loading...</div>;
  return (
    <EditorContainer>
      <LoadGrammar>
        <ToastContainer />
        <Editor
          {...props}
          defaultLanguage="noir"
          defaultValue={code}
          onChange={(value) => setCode(value)}
        />
        <ActionsBox code={code} props={props} />
      </LoadGrammar>
    </EditorContainer>
  );
}

export default NoirEditor;
