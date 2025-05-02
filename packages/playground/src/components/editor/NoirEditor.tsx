import "react-toastify/dist/ReactToastify.css";
import React, { useRef, useState, useEffect } from "react";
import { useMonaco } from "../../hooks/useMonaco";
import { useTheme } from "../../hooks/useTheme";
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
import { FileSystem } from "../../utils/fileSystem";
import ExercisesSidebar from "../exercisesSidebar/ExercisesSidebar";
import type { OrderedExercise } from "../exercisesSidebar/ExercisesSidebar";
import { createFileFromExercise, loadExerciseContent, getOrderedExercises } from "../../utils/exerciseLoader";
import ReactMarkdown from "react-markdown";
import { formatExerciseName } from "../../utils/formatExerciseName";

// Add icons for theme toggle
import { FiMoon, FiSun } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

type editorType = editor.IStandaloneCodeEditor;

function NoirEditor(props: PlaygroundProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { monaco, loaded } = useMonaco(theme);

  const [monacoEditor, setMonacoEditor] = useState<editorType | null>(null); // To track the editor instance
  const [proof, setProof] = useState<ProofData | null>(null);
  const rootFs = props.initialProject
    ? decodeProject(props.initialProject)
    : (examples.main as unknown as File);
  const [fileSystem, setFilesystem] = useState<FileSystem>(
    new FileSystem(rootFs)
  );
  const [currentPath, setCurrentPath] = useState<string>("src/main.nr");
  const [oldPath, setOldPath] = useState<string | undefined>();
  const [codeInBuffer, setCodeInBuffer] = useState<string | undefined>("");

  // State for exercises
  const [showExercisesSidebar] = useState<boolean>(true);
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [currentExerciseTitle, setCurrentExerciseTitle] = useState<string | null>(null);
  const [currentExerciseHint, setCurrentExerciseHint] = useState<string | null>(null);
  const [currentExerciseDescription, setCurrentExerciseDescription] = useState<string | null>(null);
  const [orderedExercises, setOrderedExercises] = useState<OrderedExercise[]>([]); // Store the ordered list

  // State for draggable separator
  const [infoPanelWidth, setInfoPanelWidth] = useState<number>(480); // default width in px
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // State for hint
  const [showHint, setShowHint] = useState(false);

  // Add after other useState hooks
  const [finishedExercises, setFinishedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem("noir_finished_exercises");
    return saved ? JSON.parse(saved) : [];
  });

  // Enhanced mouse event handlers for draggable separator
  useEffect(() => {
    let animationFrame: number | null = null;
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      // Minimum 220px, maximum 480px for info panel
      const min = 0;
      const max = 800;
      const newWidth = Math.min(Math.max(e.clientX, min), max);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setInfoPanelWidth(newWidth);
      });
    }
    function handleMouseUp() {
      setIsDragging(false);
    }
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isDragging]);

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
          fontSize: 14,
          language: "noir",
          fontFamily: "Fira Code Variable",
          roundedSelection: false,
          automaticLayout: true,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          theme: theme, // Use the current theme
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
  }, [monaco, monacoEditor, oldPath, currentPath, fileSystem, theme]);

  // Update editor theme when theme changes
  useEffect(() => {
    if (monaco && monacoEditor) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, monacoEditor, theme]);

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

  const handleExerciseSelect = async (
    exercisePath: string,
    exerciseName: string,
    exerciseHint?: string,
    exerciseDescription?: string
  ) => {
    try {
      // Save the selected exercise path to localStorage
      localStorage.setItem("noir_last_exercise", exercisePath);
      // Load the exercise content
      const content = await loadExerciseContent(exercisePath);
      // Create a new file system with the exercise content
      const exerciseFile = createFileFromExercise(exercisePath, content);
      setFilesystem(new FileSystem(exerciseFile));
      // Set the current exercise and path
      setCurrentExercise(exercisePath);
      setCurrentExerciseTitle(exerciseName);
      setCurrentExerciseHint(exerciseHint || null);
      setCurrentExerciseDescription(exerciseDescription || null);
      setCurrentPath("src/main.nr");
      setOldPath(undefined);
      setShowHint(false); // Hide hint by default for each new exercise
    } catch (error) {
      console.error("Failed to load exercise:", error);
    }
  };

  // Auto-load the last or first exercise on initial mount
  useEffect(() => {
    if (currentExercise !== null) return; // Don't override if already selected
    let cancelled = false;
    async function loadInitialExercise() {
      try {
        const exercises = await getOrderedExercises();
        if (!exercises || exercises.length === 0) return;
        // Try to load the last exercise from localStorage
        const lastExercisePath = localStorage.getItem("noir_last_exercise");
        let toLoad = exercises[0];
        if (lastExercisePath) {
          const found = exercises.find(
            (ex) => `${ex.category}/${ex.file}` === lastExercisePath
          );
          if (found) toLoad = found;
        }
        if (!cancelled && toLoad) {
          const exercisePath = `${toLoad.category}/${toLoad.file}`;
          await handleExerciseSelect(
            exercisePath,
            toLoad.name,
            toLoad.hint,
            toLoad.description
          );
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    loadInitialExercise();
    return () => { cancelled = true; };
  }, [currentExercise]);

  // Add effect to persist finishedExercises
  useEffect(() => {
    localStorage.setItem("noir_finished_exercises", JSON.stringify(finishedExercises));
  }, [finishedExercises]);

  const handleCompileSuccess = () => {
    if (currentExercise && !finishedExercises.includes(currentExercise)) {
      setFinishedExercises((prev) => [...prev, currentExercise]);
    }
  };

  // Fetch and store ordered exercises on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchOrdered() {
      try {
        const exercises = await getOrderedExercises();
        if (!cancelled) setOrderedExercises(exercises);
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchOrdered();
    return () => { cancelled = true; };
  }, []);

  // Compute current exercise index
  const currentExerciseIndex = orderedExercises.findIndex(
    (ex) => `${ex.category}/${ex.file}` === currentExercise
  );

  // Navigation handlers
  const handleBack = () => {
    if (currentExerciseIndex > 0) {
      const prev = orderedExercises[currentExerciseIndex - 1];
      if (prev) {
        const exercisePath = `${prev.category}/${prev.file}`;
        handleExerciseSelect(exercisePath, prev.name, prev.hint, prev.description);
      }
    }
  };

  const handleForward = () => {
    if (
      currentExerciseIndex !== -1 &&
      currentExerciseIndex < orderedExercises.length - 1
    ) {
      const next = orderedExercises[currentExerciseIndex + 1];
      if (next) {
        const exercisePath = `${next.category}/${next.file}`;
        handleExerciseSelect(exercisePath, next.name, next.hint, next.description);
      }
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top toolbar */}
      <div
        className="p-4 flex justify-between items-center border-b"
        style={{ backgroundColor: 'var(--bg-toolbar)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3 ml-2">
          <img src="/noirlingsapplogo.png" alt="Noirlings Logo" className="h-4 w-auto" style={{ maxHeight: 32 }} />
          <a
            href="http://x.com/andeebtceth/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on X (Twitter)"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer ml-1"
            style={{ backgroundColor: 'transparent' }}
          >
            <FaXTwitter size={18} color="var(--color-primary)" />
          </a>
        </div>
        <div className="flex gap-2 items-center">
          {/* <button
            className="text-white px-4 py-1 rounded hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: 'var(--bg-toolbar-btn)',
              color: 'var(--color-primary)'
            }}
            onClick={toggleExercisesSidebar}
          >
            {showExercisesSidebar ? "Hide Exercises List" : "Show Exercises List"}
          </button> */}

          {/* add finished exercises counter e.g. 1/10   */}
          <div className="text-sm text-[#768cac]">
            Finished: {finishedExercises.length}/{orderedExercises.length}
          </div>

          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: 'transparent' }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <FiSun size={18} color="var(--color-primary)" />
            ) : (
              <FiMoon size={18} color="var(--color-primary)" />
            )}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Exercises sidebar */}
        {showExercisesSidebar && (
          <div
            className="min-w-[200px] border-r overflow-y-auto max-h-60 md:max-h-none"
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              borderColor: 'var(--border-color)'
            }}
          >
            <ExercisesSidebar
              selectExercise={(path: string, name: string, hint?: string, description?: string): void => { void handleExerciseSelect(path, name, hint, description); }}
              currentExercise={currentExercise}
              finishedExercises={finishedExercises}
            />
          </div>
        )}

        {/* Info Panel + Editor side by side */}
        <div className="flex flex-1 flex-row min-h-0 w-full">
          {/* Exercise Info Panel: only takes width if currentExercise is set */}
          {currentExercise ? (
            <div
              className="hidden md:flex flex-col gap-4 border-r"
              style={{
                backgroundColor: 'var(--bg-sidebar)',
                borderColor: 'var(--border-color)',
                minWidth: 0,
                maxWidth: 800,
                width: infoPanelWidth,
                transition: isDragging ? "none" : "none",
                userSelect: isDragging ? "none" : "auto",
                cursor: isDragging ? "col-resize" : "default",
                overflowY: "auto",
                maxHeight: "100vh",
                color: 'var(--color-primary)'
              }}
            >
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    {currentExerciseTitle && formatExerciseName(currentExerciseTitle)}
                  </div>
                  <button
                    className="px-4 py-1 cursor-pointer transition-opacity border"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'transparent',
                      color: '#768cac'
                    }}
                    onClick={() => setShowHint((prev) => !prev)}
                  >
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </button>
                </div>
                {currentExerciseDescription && (
                  <div style={{ color: 'var(--color-primary)' }} className="mb-6">
                    {/* <span className="font-bold">Description</span> */}
                    <div className="markdown-body">
                      <ReactMarkdown>{currentExerciseDescription}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {currentExerciseHint && showHint && (
                  <div className="whitespace-pre-line rounded flex flex-col gap-2" style={{ color: 'var(--color-secondary)' }}>
                    <span className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>Hint</span>
                    <div className="markdown-body">
                      <ReactMarkdown>{currentExerciseHint}</ReactMarkdown>
                    </div>
                    <div className="mt-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <span style={{ color: 'var(--color-primary)' }}>
                        <a href="https://noir-lang.org/docs" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>View Noir Documentation</a>
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {loaded && !proof && (
                <ActionsBox
                  project={fileSystem}
                  props={props}
                  setProof={setProof}
                  onCompileSuccess={handleCompileSuccess}
                  onBack={currentExerciseIndex > 0 ? handleBack : undefined}
                  onForward={
                    currentExerciseIndex !== -1 && currentExerciseIndex < orderedExercises.length - 1
                      ? handleForward
                      : undefined
                  }
                />
              )}
            </div>
          ) : (
            // Render a zero-width div to not take up space when no exercise is selected
            <div className="hidden md:block" style={{ width: 0, minWidth: 0, padding: 0, border: 0 }} />
          )}

          {/* Draggable Separator */}
          {currentExercise && (
            <div
              ref={separatorRef}
              className={
                "hidden md:flex h-full select-none group"
              }
              onMouseDown={() => setIsDragging(true)}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize exercise info panel"
              tabIndex={0}
              style={{
                width: 1,
                cursor: isDragging ? "col-resize" : "ew-resize",
                background: 'var(--bg-secondary)',
                zIndex: 20,
                boxShadow: `0 0 0 1px var(--border-color)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
              }}
            >
              {/* Handle: 3 vertical dots */}
              {/* <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 24,
                  borderRadius: 2,
                  background:
                    `repeating-linear-gradient(to bottom, var(--color-accent), var(--color-accent) 2px, transparent 2px, transparent 6px)`,
                }}
                className={
                  isDragging
                    ? "opacity-100"
                    : "opacity-80 group-hover:opacity-100 transition-opacity"
                }
              /> */}
              {/* Tooltip for width removed */}
            </div>
          )}

          {/* Editor area */}
          <div
            className={`flex-1 flex flex-col min-h-0 box-border text-sm font-fira-code w-full h-auto pt-4`}
            id="noir__playground"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              minWidth: 0,
              transition: isDragging ? "none" : "width 0.15s",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            <section className="flex-1 min-h-0 w-full">
              <div ref={editorRef} id="editor" className="w-full h-64 md:h-full min-h-0 flex-1" style={{ minHeight: 0 }}></div>
            </section>

            <div className="w-full shadow rounded-br-lg flex flex-col md:flex-row flex-wrap sticky bottom-0 z-10"
              style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {loaded && proof && <ResultBox proof={proof} setProof={setProof} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoirEditor;
