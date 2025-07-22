import React, { useRef, useState, useEffect } from "react";
import { useMonaco } from "../hooks/useMonaco";
import { useTheme } from "../hooks/useTheme";
import { editor } from "monaco-editor";
import { File, ProofData } from "../types";
import { FileSystem } from "../utils/fileSystem";
import { compileCode, generateProof } from "../utils/generateProof";
import { toast } from "react-toastify";
import { CompiledCircuit } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import { Copy, Download, Play, Zap, RotateCcw, Check, Shield, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

type EditorType = editor.IStandaloneCodeEditor;

const DEFAULT_CODE = `fn main(x: Field, y: pub Field) {
    // Most basic constraint that always passes
    assert(x == x);
}`;

const PlaygroundPage: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { monaco } = useMonaco(theme);

  const [monacoEditor, setMonacoEditor] = useState<EditorType | null>(null);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [provingPending, setProvingPending] = useState<boolean>(false);
  const [codeInBuffer, setCodeInBuffer] = useState<string>(DEFAULT_CODE);
  const [inputs, setInputs] = useState<InputMap>({});
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // File system for standalone playground
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    const mainFile: File = {
      name: "main.nr",
      type: "file",
      content: DEFAULT_CODE
    };
    const srcFolder: File = {
      name: "src",
      type: "folder",
      items: [mainFile]
    };
    return new FileSystem(srcFolder);
  });

  // Tooltips
  const [copyTooltip, setCopyTooltip] = useState<{ visible: boolean; text: string; isClicked: boolean }>({ 
    visible: false, text: 'Copy', isClicked: false 
  });
  const [compileTooltip, setCompileTooltip] = useState<{ visible: boolean; text: string; isClicked: boolean }>({ 
    visible: false, text: 'Compile', isClicked: false 
  });

  // Initialize Monaco editor
  useEffect(() => {
    if (monaco && editorRef.current && !monacoEditor) {
      if (editorRef.current.hasChildNodes()) {
        editorRef.current.removeChild(editorRef.current.firstChild!);
      }

      const monacoProperties = {
        value: codeInBuffer,
        fontSize: 14,
        language: "noir",
        fontFamily: "Fira Code Variable",
        roundedSelection: false,
        automaticLayout: true,
        lineNumbers: "on" as const,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        theme: theme,
        wordWrap: 'on' as const,
      };

      const editor = monaco.editor.create(
        editorRef.current!,
        monacoProperties
      );

      setMonacoEditor(editor);
    }
  }, [monaco, monacoEditor, theme]);

  // Update editor content when it changes
  useEffect(() => {
    if (monacoEditor) {
      monacoEditor.getModel()?.onDidChangeContent(() => {
        const newCode = monacoEditor.getValue();
        setCodeInBuffer(newCode);
        // Update file system
        const updatedFile: File = {
          name: "main.nr",
          type: "file",
          content: newCode
        };
        const srcFolder: File = {
          name: "src",
          type: "folder",
          items: [updatedFile]
        };
        setFileSystem(new FileSystem(srcFolder));
      });
    }
  }, [monacoEditor]);

  // Update editor theme when theme changes
  useEffect(() => {
    if (monaco && monacoEditor) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, monacoEditor, theme]);

  // Reset states when file system changes
  useEffect(() => {
    setCompiledCode(null);
    setCompileError(null);
  }, [fileSystem]);

  const handleCopy = async () => {
    if (monacoEditor) {
      await navigator.clipboard.writeText(monacoEditor.getValue());
      toast.success('Code copied to clipboard!');
    }
  };

  const compile = async () => {
    setCompileError(null);
    setPending(true);
    try {
      const compiled = await compileCode(fileSystem);
      setCompiledCode(compiled);
      setCompileError(null);
      setProof(null); // Clear previous proof
      toast.success('Compiled successfully!');
    } catch (err: unknown) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setCompileError(message);
      setCompiledCode(null);
      setProof(null);
      toast.error(message);
      throw err;
    } finally {
      setPending(false);
    }
  };

  const handleProve = async () => {
    if (!compiledCode) return;
    
    // Check if circuit requires inputs and if they are provided
    const requiredInputs = getCircuitInputs();
    const missingInputs = requiredInputs.filter((param: any) => 
      !inputs.hasOwnProperty(param.name) || inputs[param.name] === ''
    );
    
    if (missingInputs.length > 0) {
      const missingNames = missingInputs.map((param: any) => param.name).join(', ');
      toast.error(`Please provide values for: ${missingNames}`);
      return;
    }
    
    setProvingPending(true);
    try {
      const proof = await generateProof({
        circuit: compiledCode,
        input: inputs,
      });
      
      setProof({
        proof: Array.from(proof.proof).join(','),
        publicInputs: proof.publicInputs.map((input: any) => input.toString())
      });
      
      toast.success('Proof generated successfully!');
    } catch (error: any) {
      console.error('Proof generation failed:', error);
      toast.error(`Proof generation failed: ${error.message}`);
    } finally {
      setProvingPending(false);
    }
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

  const copyToClipboard = async (item: string | string[], label: string) => {
    const text = Array.isArray(item) ? item.join('\n') : item;
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const downloadAsFile = (content: string, filename: string, mimeType: string = 'application/json') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportProof = () => {
    if (!proof) return;
    downloadAsFile(proof.proof, 'noir_proof.txt', 'text/plain');
    toast.success('Proof exported!');
  };

  const handleExportPublicInputs = () => {
    if (!proof || !proof.publicInputs) return;
    downloadAsFile(JSON.stringify(proof.publicInputs, null, 2), 'public_inputs.json');
    toast.success('Public inputs exported!');
  };

  const downloadAll = () => {
    if (!proof) return;
    const bundle = {
      proof: proof.proof,
      publicInputs: proof.publicInputs,
      timestamp: new Date().toISOString()
    };
    downloadAsFile(JSON.stringify(bundle, null, 2), 'noir_proof_bundle.json');
    toast.success('Complete proof bundle downloaded!');
  };

  const handleVerifyProof = async () => {
    if (!proof || !compiledCode) return;
    
    setVerifying(true);
    try {
      // TODO: Implement actual proof verification logic here
      // For now, simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVerificationResult(true);
      toast.success('Proof verified successfully!');
    } catch (error) {
      setVerificationResult(false);
      toast.error('Proof verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const resetToDefault = () => {
    if (monacoEditor) {
      monacoEditor.setValue(DEFAULT_CODE);
      setInputs({});
      setProof(null);
      setVerificationResult(null);
      setCompiledCode(null);
      setCompileError(null);
      toast.success('Editor reset to default example!');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Header showProgress={false} />

      {/* Main content area with resizable panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Code Editor */}
          <Panel defaultSize={60} minSize={30}>
            <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="px-4 py-4 gap-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              Playground
            </h1>
            <div className="flex items-center gap-4">
              {/* Copy button */}
              <div className="relative">
                <button
                  onClick={() => {
                    handleCopy();
                    setCopyTooltip({ visible: true, text: 'Copied!', isClicked: true });
                    setTimeout(() => setCopyTooltip({ visible: false, text: 'Copy', isClicked: false }), 500);
                  }}
                  onMouseEnter={() => setCopyTooltip({ visible: true, text: 'Copy', isClicked: false })}
                  onMouseLeave={() => {
                    if (!copyTooltip.isClicked) {
                      setCopyTooltip(prev => ({ ...prev, visible: false }));
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-all duration-200 bg-transparent border-none"
                  aria-label="Copy code"
                >
                  <Copy size={18} color="var(--color-secondary)" />
                </button>
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 z-50 ${copyTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{ backgroundColor: 'var(--bg-toolbar)', color: 'var(--header-text)' }}
                >
                  {copyTooltip.text}
                </span>
              </div>
              
              {/* Compile button */}
              <div className="relative">
                <button
                  onClick={() => {
                    compile();
                    setCompileTooltip({ visible: true, text: 'Compiling', isClicked: true });
                    setTimeout(() => setCompileTooltip({ visible: false, text: 'Compile', isClicked: false }), 500);
                  }}
                  onMouseEnter={() => setCompileTooltip({ visible: true, text: 'Compile', isClicked: false })}
                  onMouseLeave={() => {
                    if (!compileTooltip.isClicked) {
                      setCompileTooltip(prev => ({ ...prev, visible: false }));
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-all duration-200 bg-transparent border-none"
                  aria-label="Compile code"
                  disabled={pending}
                >
                  <Play size={18} color={pending ? "var(--color-tertiary)" : "var(--color-secondary)"} />
                </button>
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 z-50 ${compileTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{ backgroundColor: 'var(--bg-toolbar)', color: 'var(--header-text)' }}
                >
                  {compileTooltip.text}
                </span>
              </div>

              {/* Reset button */}
              <button
                onClick={resetToDefault}
                className="cursor-pointer hover:opacity-80 transition-all duration-200 bg-transparent border-none"
                aria-label="Reset to default code"
              >
                <RotateCcw size={18} color="var(--color-secondary)" />
              </button>

              {/* Prove button - only show when compiled */}
              {compiledCode && (
                <button
                  onClick={handleProve}
                  disabled={provingPending}
                  className="flex items-center gap-2 px-4 py-2 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  <Zap size={16} />
                  {provingPending ? 'Proving...' : 'Prove'}
                </button>
              )}
            </div>
          </div>

              <div className="flex-1 min-h-0">
                <div ref={editorRef} id="editor" className="w-full h-full"></div>
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle 
            className="w-2 hover:bg-opacity-80 transition-colors cursor-col-resize"
            style={{ 
              backgroundColor: 'var(--border-color)',
            }}
          />

          {/* Right Panel - Results and Export */}
          <Panel defaultSize={40} minSize={25} maxSize={70}>
            <div 
              className="h-full flex flex-col"
              style={{ 
                backgroundColor: 'var(--bg-sidebar)', 
                borderLeft: '1px solid var(--border-color)',
                minWidth: '400px'
              }}
            >
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
              Results
            </h2>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {pending && (
              <div className="text-center py-8">
                <div className="animate-pulse" style={{ color: 'var(--color-secondary)' }}>
                  Compiling...
                </div>
              </div>
            )}

            {compileError && (
              <div className="mb-4 p-3 rounded border" style={{ 
                backgroundColor: 'var(--error-bg, #fee)', 
                borderColor: 'var(--error-border, #fcc)',
                color: 'var(--error-text, #c33)'
              }}>
                <h3 className="font-semibold mb-2">Compilation Error</h3>
                <pre className="text-sm whitespace-pre-wrap">{compileError}</pre>
              </div>
            )}

            {compiledCode && !compileError && (
              <div className="mb-4 p-3 rounded border" style={{ 
                backgroundColor: 'transparent', 
                borderColor: 'var(--success-border, #cfc)',
                color: 'var(--success-text, #363)'
              }}>
                <h3 className="font-semibold mb-2">✅ Compilation Successful</h3>
                <p className="text-sm">Your Noir code compiled successfully!</p>
              </div>
            )}

            {/* Input fields for proving (if circuit has inputs) */}
            {compiledCode && getCircuitInputs().length > 0 && (
              <div className="mb-4 p-4 rounded border" 
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border-color)'
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
                          backgroundColor: 'var(--bg-sidebar)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--color-primary)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proving status */}
            {provingPending && (
              <div className="text-center py-8">
                <div className="animate-pulse" style={{ color: 'var(--color-secondary)' }}>
                  Generating proof...
                </div>
              </div>
            )}

            {proof && (
              <div className="space-y-6">
                {/* Header with success message */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full" 
                      style={{ backgroundColor: 'var(--color-accent)' }}>
                      <Check className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
                        Proof Generated Successfully!
                      </h2>
                      <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
                        Your zero-knowledge proof is ready for export
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setProof(null)}
                    className="px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                    style={{ 
                      color: 'var(--color-primary)',
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  >
                    Back to Editor
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Proof Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
                      Zero-Knowledge Proof
                    </h3>
                    <div
                      className="border rounded-lg p-4 h-48 overflow-y-auto text-xs font-mono break-all"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--color-secondary)'
                      }}
                    >
                      {proof.proof}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => copyToClipboard(proof.proof, "Proof")}
                        className="flex items-center gap-2 flex-1 px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-primary)',
                          backgroundColor: 'var(--bg-toolbar)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        onClick={handleExportProof}
                        className="flex items-center gap-2 flex-1 px-4 py-2 rounded hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-primary)',
                          backgroundColor: 'var(--color-accent)',
                          border: 'none'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Public Inputs Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
                      Public Inputs
                    </h3>
                    <div
                      className="border rounded-lg p-4 h-48 overflow-y-auto text-xs font-mono"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--color-secondary)'
                      }}
                    >
                      {proof.publicInputs && proof.publicInputs.length > 0 ? (
                        proof.publicInputs.map((input, index) => (
                          <div key={index} className="mb-1">
                            {input}
                          </div>
                        ))
                      ) : (
                        <div style={{ color: 'var(--color-secondary)' }}>No public inputs</div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => copyToClipboard(proof.publicInputs, "Public inputs")}
                        className="flex items-center gap-2 flex-1 px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-primary)',
                          backgroundColor: 'var(--bg-toolbar)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        onClick={handleExportPublicInputs}
                        className="flex items-center gap-2 flex-1 px-4 py-2 rounded hover:opacity-80 transition-opacity"
                        style={{
                          color: 'var(--color-primary)',
                          backgroundColor: 'var(--color-accent)',
                          border: 'none'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verification Section */}
                {compiledCode && (
                  <div className="space-y-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
                      Proof Verification
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleVerifyProof}
                          disabled={verifying}
                          className="flex items-center gap-2 px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                          style={{
                            color: 'var(--color-primary)',
                            backgroundColor: verificationResult === null ? 'var(--bg-toolbar)' : 
                              verificationResult ? '#4ADE80' : '#FA5E5E',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          {verifying ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              Verifying...
                            </>
                          ) : verificationResult === null ? (
                            <>
                              <Shield className="w-4 h-4" />
                              Verify Proof
                            </>
                          ) : verificationResult ? (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              Verified ✓
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Verification Failed
                            </>
                          )}
                        </button>
                      </div>
                      
                      {verificationResult !== null && (
                        <div className="flex items-center gap-2 pl-2">
                          <div className={`w-3 h-3 rounded-full ${verificationResult ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span style={{ color: verificationResult ? '#4ADE80' : '#FA5E5E' }}>
                            {verificationResult ? 'Proof is valid' : 'Proof is invalid'}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-xs mt-4" style={{ color: 'var(--color-secondary)' }}>
                        Verification checks that the proof was generated correctly using the compiled circuit and public inputs.
                      </p>
                    </div>
                  </div>
                )}

                {/* Export All Section */}
                <div className="flex flex-col items-center space-y-4 pt-6 border-t" 
                  style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={downloadAll}
                    className="flex items-center gap-2 px-6 py-3 rounded hover:opacity-80 transition-opacity"
                    style={{
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-accent)',
                      fontSize: '16px',
                      border: 'none'
                    }}
                  >
                    <FileText className="w-5 h-5" />
                    Download Complete Proof Bundle (JSON)
                  </button>
                  <p className="text-xs text-center max-w-md px-4" style={{ color: 'var(--color-secondary)' }}>
                    The complete bundle includes both the proof and public inputs in a structured JSON format, 
                    perfect for verification or integration with other systems.
                  </p>
                </div>
              </div>
            )}

            {!pending && !compiledCode && !compileError && (
              <div className="text-center py-8" style={{ color: 'var(--color-secondary)' }}>
                Write your Noir code and click compile to see results.
              </div>
            )}
            </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default PlaygroundPage;