import React, { FormEvent, useState, useEffect } from "react";
import { ChevronRight, CheckCircle, X, Play } from "lucide-react";

import { CompiledCircuit } from "@noir-lang/types";
import { Button } from "../buttons/buttons";
import { ButtonContainer } from "../buttons/containers";
import { FileSystem } from "../../utils/fileSystem";
import pkg from '../../../package.json';

export const ActionsBox = ({ project, onCompileSuccess, onForward, compiledCode, compileError, pending, compile }: { 
  project: FileSystem; 
  onCompileSuccess?: () => void; 
  onForward?: () => void; 
  compiledCode: CompiledCircuit | null; 
  compileError: string | null; 
  pending: boolean; 
  compile: (project: FileSystem) => Promise<void>; 
}) => {

  const [showSuccessAlert, setShowSuccessAlert] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !pending) {
        setShowSuccessAlert(true);
        setShowErrorAlert(true);
        compile(project).then(() => {
          if (onCompileSuccess) onCompileSuccess();
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [compile, project, onCompileSuccess, pending]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset alert states so messages show up on new compilation
    setShowSuccessAlert(true);
    setShowErrorAlert(true);

    // Always compile when the compile button is clicked
    await compile(project);
    if (onCompileSuccess) onCompileSuccess();
  };

  return (
    <>      
      <form
        className="flex flex-auto flex-col justify-end"
        onSubmit={(e) => submit(e)}
      >
        <ButtonContainer>
          {/* Enhanced Success Message */}
          {compiledCode && showSuccessAlert && (
            <div className="mx-6 mb-4 px-4 py-3 w-full rounded shadow-sm animate-fadeIn transition-all duration-100 ease-in-out border border-[#4ADE80]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                  <span className="font-medium text-[#4ADE80]">Compiled successfully!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSuccessAlert(false)}
                  className="text-[#4ADE80] hover:text-[#4ADE80] transition-colors cursor-pointer bg-transparent border-none p-1 rounded flex items-center justify-center"
                  aria-label="Dismiss success message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Error Message */}
          {compileError && showErrorAlert && (
            <div className="mx-6 mb-4 px-4 py-3 rounded shadow-sm animate-fadeIn transition-all duration-100 ease-in-out border border-[#FA5E5E] w-full">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className="text-[#FA5E5E]">
                    {/* <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <div className="font-medium my-2">Compilation Error</div>
                    </div> */}
                    <div className="text-sm font-normal">
                      {compileError}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowErrorAlert(false)}
                  className="text-[#FA5E5E] hover:text-[#FA5E5E] transition-colors cursor-pointer flex-shrink-0 bg-transparent border-none p-1 rounded flex items-center justify-center"
                  aria-label="Dismiss error message"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="w-full flex flex-row justify-between items-center gap-3 mx-6">
            <Button
              type="submit"
              $primary={true}
              className={`cursor-pointer flex-[2] h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity ${pending ? 'cursor-not-allowed opacity-80' : 'hover:scale-[1]'
                }`}
              disabled={pending}
            >
              <div className="flex items-center justify-center gap-2">
                {pending ? <></> : <Play className="w-5 h-5" />}
                <span>{pending ? "Compiling..." : "Compile"}</span>
              </div>
            </Button>

            <button
              type="button"
              className="cursor-pointer w-12 h-12 flex items-center justify-center group rounded hover:opacity-80 transition-opacity"
              disabled={pending || !onForward}
              onClick={onForward}
              title="Go to next exercise"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-toolbar-btn)',
                opacity: onForward ? 1 : 0.1,
                border: 'none'
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-row justify-between mx-6 text-xs w-full opacity-50" style={{ color: 'var(--color-secondary)' }}>
            <p><span className="font-mono">Ctrl+Enter</span> to compile</p>
            <p>Noir v{pkg.dependencies['@noir-lang/noir_js']}</p>
          </div>

        </ButtonContainer>
      </form>
    </>
  );
};
