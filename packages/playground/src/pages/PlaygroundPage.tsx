import React, { useRef, useState, useEffect } from "react";
import { useMonaco } from "../hooks/useMonaco";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { editor } from "monaco-editor";
import { File, ProofData } from "../types";
import { FileSystem } from "../utils/fileSystem";
import { compileCode, generateProof } from "../utils/generateProof";
import { toast } from "react-toastify";
import { CompiledCircuit } from "@noir-lang/types";
import { InputMap } from "@noir-lang/noirc_abi";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Github, Copy, Download, Play, Zap } from 'lucide-react';

type EditorType = editor.IStandaloneCodeEditor;

const DEFAULT_CODE = `fn main(x: u32, y: pub u32) {
    assert(x != y);
}

#[test]
fn test_main() {
    main(1, 2);
}`;

const PlaygroundPage: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { monaco, loaded } = useMonaco(theme);
  const { user, login, logout } = useAuth();
  const location = useLocation();

  const [monacoEditor, setMonacoEditor] = useState<EditorType | null>(null);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [provingPending, setProvingPending] = useState<boolean>(false);
  const [codeInBuffer, setCodeInBuffer] = useState<string>(DEFAULT_CODE);
  const [inputs, setInputs] = useState<InputMap>({});

  // File system for standalone playground
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    const mainFile: File = {
      name: "main.nr",
      content: DEFAULT_CODE,
      path: "src/main.nr"
    };
    const rootFile: File = {
      name: "src",
      children: [mainFile]
    };
    return new FileSystem(rootFile);
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
        // @ts-expect-error - monaco types are not up to date
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
          content: newCode,
          path: "src/main.nr"
        };
        const rootFile: File = {
          name: "src",
          children: [updatedFile]
        };
        setFileSystem(new FileSystem(rootFile));
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
    
    setProvingPending(true);
    try {
      const proof = await generateProof({
        circuit: compiledCode,
        input: inputs,
        threads: navigator.hardwareConcurrency || 1
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

  const handleExportProof = () => {
    if (!proof) return;
    
    const dataStr = JSON.stringify(proof, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'noir_proof.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Proof exported!');
  };

  const handleExportPublicInputs = () => {
    if (!proof || !proof.publicInputs) return;
    
    const dataStr = JSON.stringify(proof.publicInputs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'public_inputs.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Public inputs exported!');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top toolbar */}
      <div
        className="px-4 py-2 flex justify-between items-center border-b"
        style={{ backgroundColor: 'var(--bg-toolbar)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3 ml-2">
          <Link
            to="/"
            style={{
              color: location.pathname === "/" ? 'var(--color-accent)' : 'var(--color-secondary)',
              textDecoration: 'none',
            }}
          >
            {theme === 'light' ? (
              <img src="/noirlingsapplogo-white.png" alt="Noirlings Logo" className="h-4 w-auto" style={{ maxHeight: 32 }} />
            ) : (
              <img src="/noirlingsapplogo-white.png" alt="Noirlings Logo" className="h-4 w-auto" style={{ maxHeight: 32 }} />
            )}
          </Link>
          <div className="ml-4 flex gap-4 items-center">
            <Link
              to="/"
              style={{
                color: location.pathname === "/" ? 'var(--subheader-text)' : 'var(--header-text)',
                textDecoration: 'none',
              }}
            >
              Basic
            </Link>
            <Link
              to="/advanced"
              style={{
                color: location.pathname === "/advanced" ? 'var(--subheader-text)' : 'var(--header-text)',
                textDecoration: 'none',
              }}
            >
              Advanced
            </Link>
            <Link
              to="/playground"
              style={{
                color: location.pathname === "/playground" ? 'var(--subheader-text)' : 'var(--header-text)',
                textDecoration: 'none',
              }}
            >
              Playground
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: 'transparent', }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Sun size={18} color="var(--header-text)" />
            ) : (
              <Moon size={18} color="var(--header-text)" />
            )}
          </button>

          <div>
            <div className="flex items-center">
              {user ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User avatar"
                  className="w-10 h-10 rounded-l object-cover ml-3 border border-r-0"
                  style={{ color: "var(--header-text)", borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}
                />
              ) : (
                <div className="ml-3" />
              )}

              <button
                className={`text-base px-4 py-2 ${user ? 'rounded-r border-l-0 ' : 'rounded'} hover:opacity-80 transition-opacity border flex items-center gap-2 cursor-pointer`}
                style={{ color: "var(--header-text)", borderColor: 'var(--border-color)', backgroundColor: 'transparent' }}
                onClick={user ? logout : login}
              >
                {user ? (
                  <div className="group flex items-center gap-2">
                    <span className="group-hover:hidden">{user.user_metadata.user_name || 'User'}</span>
                    <span className="hidden group-hover:block">Logout</span>
                  </div>
                ) : (
                  <>
                    <Github size={16} color="var(--header-text)" />
                    <span>Login with GitHub</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col min-h-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="px-4 py-4 gap-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h1 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              Noir Playground
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

        {/* Right Panel - Results and Export */}
        <div 
          className="w-96 border-l flex flex-col"
          style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}
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
                backgroundColor: 'var(--success-bg, #efe)', 
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
              <div className="mb-4">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  Generated Proof
                </h3>
                <div className="mb-4 p-3 rounded border text-sm" style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--color-secondary)'
                }}>
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(proof, null, 2)}
                  </pre>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleExportProof}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border-color)',
                      color: 'var(--color-primary)'
                    }}
                  >
                    <Download size={16} />
                    Export Proof
                  </button>
                  
                  {proof.publicInputs && (
                    <button
                      onClick={handleExportPublicInputs}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded border hover:opacity-80 transition-opacity"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--color-primary)'
                      }}
                    >
                      <Download size={16} />
                      Export Public Inputs
                    </button>
                  )}
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
      </div>
    </div>
  );
};

export default PlaygroundPage;