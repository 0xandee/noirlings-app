import React, { FormEvent, useState, useEffect } from "react";
import { ChevronRight, CheckCircle, X, Play, Zap } from "lucide-react";

import { CompiledCircuit } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import { Button } from "../buttons/buttons";
import { ButtonContainer } from "../buttons/containers";
import { FileSystem } from "../../utils/fileSystem";
import { generateProof } from "../../utils/generateProof";
import { ProofData } from "../../types";
import { toast } from "react-toastify";
import pkg from '../../../package.json';

export const ActionsBox = ({ 
  project, 
  onCompileSuccess, 
  onForward, 
  compiledCode, 
  compileError, 
  pending, 
  compile,
  setProof,
  threads = 1
}: { 
  project: FileSystem; 
  onCompileSuccess?: () => void; 
  onForward?: () => void; 
  compiledCode: CompiledCircuit | null; 
  compileError: string | null; 
  pending: boolean; 
  compile: (project: FileSystem) => Promise<void>; 
  setProof?: React.Dispatch<React.SetStateAction<ProofData | null>>;
  threads?: number;
}) => {

  const [showSuccessAlert, setShowSuccessAlert] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const [provingPending, setProvingPending] = useState(false);
  const [inputs, setInputs] = useState<InputMap>({});

  const handleProve = async () => {
    if (!compiledCode || !setProof) return;
    
    setProvingPending(true);
    try {
      const proof = await generateProof({
        circuit: compiledCode,
        input: inputs,
        threads: threads
      });
      
      setProof({
        proof: Array.from(proof.proof).join(','),
        publicInputs: proof.publicInputs.map(input => input.toString())
      });
      
      toast.success('Proof generated successfully!');
    } catch (error: any) {
      console.error('Proof generation failed:', error);
      toast.error(`Proof generation failed: ${error.message}`);
    } finally {
      setProvingPending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !pending) {
        setShowSuccessAlert(true);
        setShowErrorAlert(true);
        compile(project).then(() => {
          if (onCompileSuccess) onCompileSuccess();
        });
      } else if (e.altKey && e.key === 'Enter' && !provingPending && compiledCode && setProof) {
        e.preventDefault();
        handleProve();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [compile, project, onCompileSuccess, pending, handleProve, provingPending, compiledCode, setProof]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset alert states so messages show up on new compilation
    setShowSuccessAlert(true);
    setShowErrorAlert(true);

    // Always compile when the compile button is clicked
    await compile(project);
    if (onCompileSuccess) onCompileSuccess();
  };

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Simple input extraction from compiled circuit
  const getCircuitInputs = () => {
    if (!compiledCode?.abi) return [];
    return compiledCode.abi.parameters || [];
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

          {/* Input fields for proving (if circuit has inputs) */}
          {compiledCode && getCircuitInputs().length > 0 && (
            <div className="mx-6 mb-4 p-4 rounded" 
              style={{ 
                backgroundColor: 'var(--bg-sidebar)', 
                borderColor: 'var(--border-color)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-primary)' }}>
                Circuit Inputs
              </h4>
              <div className="space-y-2">
                {getCircuitInputs().map((param: any) => (
                  <div key={param.name} className="flex flex-col">
                    <label 
                      className="text-xs mb-1" 
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      {param.name}
                    </label>
                    <input
                      type="text"
                      value={typeof inputs[param.name] === 'string' ? inputs[param.name] as string : ''}
                      onChange={(e) => handleInputChange(param.name, e.target.value)}
                      placeholder={`Enter ${param.name}`}
                      className="px-3 py-2 text-sm rounded border"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--color-primary)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Status Indicator */}
          <div className="mx-6 mb-3">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-secondary)' }}>
              <span>Status:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${compiledCode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>Compiled</span>
                </div>
                {compiledCode && setProof && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getCircuitInputs().length === 0 || Object.keys(inputs).length >= getCircuitInputs().length ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>Inputs {getCircuitInputs().length > 0 ? `(${Object.keys(inputs).length}/${getCircuitInputs().length})` : '(Ready)'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-between items-center gap-3 mx-6">
            <div className="flex gap-2 flex-[2]">
              <Button
                type="submit"
                $primary={true}
                className={`cursor-pointer flex-1 h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity ${pending ? 'cursor-not-allowed opacity-80' : 'hover:scale-[1]'
                  }`}
                disabled={pending}
              >
                <div className="flex items-center justify-center gap-2">
                  {pending ? <></> : <Play className="w-4 h-4" />}
                  <span>{pending ? "Compiling..." : "Compile"}</span>
                </div>
              </Button>

              {compiledCode && setProof && (
                <Button
                  type="button"
                  onClick={handleProve}
                  disabled={provingPending || !compiledCode}
                  className={`cursor-pointer flex-1 h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity ${provingPending ? 'cursor-not-allowed opacity-80' : 'hover:scale-[1]'}`}
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-primary)',
                    border: 'none'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {provingPending ? <></> : <Zap className="w-4 h-4" />}
                    <span>{provingPending ? "Proving..." : "Prove"}</span>
                  </div>
                </Button>
              )}
            </div>

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
            <div className="flex gap-4">
              <p><span className="font-mono">Ctrl+Enter</span> to compile</p>
              {compiledCode && setProof && (
                <p><span className="font-mono">Alt+Enter</span> to prove</p>
              )}
            </div>
            <p>Noir v{pkg.dependencies['@noir-lang/noir_js']}</p>
          </div>

        </ButtonContainer>
      </form>
    </>
  );
};
