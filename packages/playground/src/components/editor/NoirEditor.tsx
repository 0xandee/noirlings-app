import "react-toastify/dist/ReactToastify.css";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useMonaco } from "../../hooks/useMonaco";
import {
  decodeProject,
  decodeSnippet,
  encodeSnippet,
} from "../../utils/shareSnippet";
import examples from "../../syntax/examples.json";
import { ActionsBox } from "../actionsBox/actions";
import { File, PlaygroundProps, ProofData } from "../../types";
import { ResultBox } from "../resultBox/result";
import { editor } from "monaco-editor";
import Directory from "../fileExplorer/Directory";
import { FileSystem } from "../../utils/fileSystem";

type editorType = editor.IStandaloneCodeEditor;

function NoirEditor(props: PlaygroundProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const { monaco, loaded } = useMonaco();

  const [monacoEditor, setMonacoEditor] = useState<editorType | null>(null); // To track the editor instance
  const [proof, setProof] = useState<ProofData | null>(null);
  const rootFs = props.initialProject
    ? decodeProject(props.initialProject)
    : (examples.main as unknown as File);
  const [fileSystem, setFilesystem] = useState<FileSystem>(
    new FileSystem(rootFs)
  );
  const [currentPath, setCurrentPath] = useState<string>("root/src/main.nr");
  const [oldPath, setOldPath] = useState<string | undefined>();
  const [codeInBuffer, setCodeInBuffer] = useState<string | undefined>("");

  useEffect(() => {
    async function load() {
      if (monaco && editorRef.current && !monacoEditor) {
        const initialCode = decodeSnippet(
          fileSystem.getByPath(currentPath).content as string
        );
        setCodeInBuffer(initialCode);
        if (editorRef.current.hasChildNodes())
          editorRef.current.removeChild(editorRef.current.firstChild!);

        const monacoProperties = {
          value: initialCode,
          fontSize: 18,
          language: "noir",
          fontFamily: "Fira Code Variable",
          roundedSelection: false,
          automaticLayout: true,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
        };
        const editor = monaco.editor.create(
          editorRef.current!,
          // @ts-expect-error - monaco types are not up to date
          monacoProperties
        );

        setMonacoEditor(editor);
      } else if (monacoEditor) {
        monacoEditor?.getModel()?.onDidChangeContent(() => {
          setCodeInBuffer(monacoEditor?.getValue());
        });
      }
    }
    load();
  }, [monaco, monacoEditor, oldPath, currentPath, fileSystem]);

  useEffect(() => {
    if (currentPath !== oldPath) {
      setOldPath(currentPath);
      monacoEditor?.setValue(
        decodeSnippet(fileSystem.getByPath(currentPath).content as string)
      );
    } else {
      setFilesystem((fs) =>
        fs.updateByPath(currentPath, encodeSnippet(codeInBuffer as string))
      );
    }
  }, [currentPath, oldPath, monacoEditor, fileSystem, codeInBuffer]);

  return (
    <div className="h-full w-full flex flex-row">
      <div className="w-1/4 text-lg flex bg-yellow-4 shadow rounded-bl-lg flex-column pl-6 border-r-yellow-6 border-r-2">
        <Directory
          files={fileSystem.root}
          selectFile={setCurrentPath}
          currentPath={currentPath}
        ></Directory>
      </div>
      <div
        className="w-3/4 flex items-stretch flex-col box-border text-sm font-fira-code"
        id="noir__playground"
      >
        <ToastContainer />
        <section style={props.style}>
          <div ref={editorRef} id="editor" className="w-full h-full"></div>
        </section>

        <div className="w-full bg-yellow-4 shadow rounded-br-lg flex flex-row flex-wrap">
          {loaded && !proof && (
            <ActionsBox
              project={fileSystem}
              props={props}
              setProof={setProof}
            />
          )}
          {loaded && proof && <ResultBox proof={proof} setProof={setProof} />}
        </div>
      </div>
    </div>
  );
}

export default NoirEditor;
