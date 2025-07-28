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
import { File, PlaygroundProps } from "../../types";
import { editor } from "monaco-editor";
import { FileSystem } from "../../utils/fileSystem";
import ExercisesSidebar from "../exercisesSidebar/ExercisesSidebar";
import AdvancedExercisesSidebar from "../advancedExercisesSidebar/AdvancedExercisesSidebar";
import type { OrderedExercise } from "../exercisesSidebar/ExercisesSidebar";
import { BASIC_CATEGORIES, ADVANCED_CATEGORIES, loadExerciseData, getOrderedExercises, getAdvancedExercises } from "../../utils/exerciseLoader";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatExerciseName } from "../../utils/formatExerciseName";
import { useAuth, supabase } from "../../hooks/useAuth";
import debounce from 'lodash/debounce';
import { Header } from '../Header';

// Add icons for theme toggle
import { Copy, RotateCcw, Play, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

// Add new imports
import { compileCode } from "../../utils/generateProof";
import { toast } from "react-toastify";
import { CompiledCircuit } from "@noir-lang/types";
import { createFileFromExercise } from "../../utils/exerciseLoader";

type editorType = editor.IStandaloneCodeEditor;

// Custom code block component for syntax highlighting
interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  theme: string;
  [key: string]: any;
}

const CodeBlock = ({ node, inline, className, children, theme, ...props }: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  if (!inline && language) {
    return React.createElement(
      SyntaxHighlighter as any,
      {
        style: theme === 'dark' ? oneDark : oneLight,
        language: language === 'noir' ? 'rust' : language, // Use Rust syntax for Noir
        PreTag: "div",
        customStyle: {
          margin: '0.5em 0',
          borderRadius: '4px',
          backgroundColor: theme === 'dark' ? 'var(--hint-bg)' : 'var(--code-bg)',
        },
        codeTagProps: {
          style: {
            fontFamily: '"Fira Code Variable", "Fira Code", monospace',
            fontSize: '0.9em',
          }
        },
        ...props
      },
      String(children || '').replace(/\n$/, '')
    );
  }
  
  // For inline code, use the existing styling
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

function NoirEditor(props: PlaygroundProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const { monaco, loaded } = useMonaco(theme);

  const [monacoEditor, setMonacoEditor] = useState<editorType | null>(null); // To track the editor instance
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
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
  const [showExercisesSidebar, setShowExercisesSidebar] = useState<boolean>(() => {
    const saved = localStorage.getItem("noir_sidebar_visible");
    return saved !== null ? JSON.parse(saved) : true;
  });
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
  const { user } = useAuth();
  const [finishedExercises, setFinishedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem("noir_finished_exercises");
    return saved ? JSON.parse(saved) : [];
  });

  // Toggle function for exercises sidebar
  const toggleExercisesSidebar = () => {
    setShowExercisesSidebar(prev => {
      const newState = !prev;
      localStorage.setItem("noir_sidebar_visible", JSON.stringify(newState));
      return newState;
    });
  };

  // Add states for last_exercise and theme (they already exist, but ensure sync)
  // Note: currentExercise is set from last_exercise

  // Add new state after existing states
  const [initialExerciseContent, setInitialExerciseContent] = useState<string>('');
  const [currentDocLink, setCurrentDocLink] = useState<string | null>(null);

  const [copyTooltip, setCopyTooltip] = useState<{ visible: boolean; text: string; isClicked: boolean }>({ visible: false, text: 'Copy', isClicked: false });
  const [resetTooltip, setResetTooltip] = useState<{ visible: boolean; text: string; isClicked: boolean }>({ visible: false, text: 'Reset', isClicked: false });
  const [compileTooltip, setCompileTooltip] = useState<{ visible: boolean; text: string; isClicked: boolean }>({ visible: false, text: 'Compile', isClicked: false });

  // Default documentation URL
  const DEFAULT_DOC_URL = "https://noir-lang.org/docs";

  // Add at top of NoirEditor:
  const normalizePath = (path: string | null | undefined) => path ? path.replace(/\.nr$/, '') : '';

  // New function to load from Supabase
  const loadProgress = async () => {
    if (user) {
      try {
        const client = supabase();
        if (!client) {
          console.warn('Supabase client not available for progress loading');
          return;
        }
        const { data, error } = await client.from('user_progress').select('*').eq('user_id', user!.id).single();
        if (error) {
          console.error('Error loading progress:', error);
          return;
        }
        if (data) {
          setFinishedExercises((data.finished_exercises as string[] || []).map(normalizePath));
          if (data.last_exercise) {
            // Check if last exercise belongs to current mode
            const lastExerciseCategory = normalizePath(data.last_exercise).split('/')[0];
            const currentModeCategories = props.isAdvancedMode ? ADVANCED_CATEGORIES : BASIC_CATEGORIES;
            const lastExerciseInMode = currentModeCategories.includes(lastExerciseCategory);

            if (lastExerciseInMode) {
              // Load last exercise only if it belongs to current mode
              const exercises = props.isAdvancedMode ? await getAdvancedExercises() : await getOrderedExercises();
              const toLoad = exercises.find((ex: OrderedExercise) => `${ex.category}/${ex.id}` === normalizePath(data.last_exercise)) || exercises[0];
              handleExerciseSelect(`${toLoad.category}/${toLoad.id}`);
            }
            // If last exercise doesn't belong to current mode, let the mode switch useEffect handle it
          }
          if (data.theme) setTheme(data.theme);
        }
      } catch (err) {
        console.error('Unexpected error loading progress:', err);
      }
    }
  };

  // Modify the sync useEffect:
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const client = supabase();
          if (!client) {
            console.warn('Supabase client not available for progress sync');
            return;
          }
          // First, load current DB progress
          const { data: dbData, error: loadError } = await client.from('user_progress').select('*').eq('user_id', user!.id).single();
          if (loadError && loadError.code !== 'PGRST116') { // Ignore if no row exists
            console.error('Error loading DB progress for merge:', loadError);
            return;
          }

          const localFinished = JSON.parse(localStorage.getItem('noir_finished_exercises') || '[]').map(normalizePath);
          const localLast = normalizePath(localStorage.getItem('noir_last_exercise') || '');
          const localTheme = localStorage.getItem('noir_theme') || 'dark';

          // Prepare merged data
          let shouldUpsert = false;
          const mergedData = {
            user_id: user!.id,
            finished_exercises: dbData?.finished_exercises || [],
            last_exercise: dbData?.last_exercise || null,
            theme: dbData?.theme || 'dark',
          };

          // Merge finished_exercises if local has any
          if (localFinished.length > 0) {
            mergedData.finished_exercises = [...new Set([...mergedData.finished_exercises, ...localFinished])];
            shouldUpsert = true;
          }

          // Use local last_exercise if present and DB doesn't have one, or prefer recent (simple: prefer local if exists)
          if (localLast && !mergedData.last_exercise) {
            mergedData.last_exercise = localLast;
            shouldUpsert = true;
          }

          // Similar for theme
          if (localTheme && mergedData.theme !== localTheme) {
            mergedData.theme = localTheme;
            shouldUpsert = true;
          }

          if (shouldUpsert) {
            const { error } = await client.from('user_progress').upsert(mergedData, { onConflict: 'user_id' });
            if (error) {
              console.error('Error syncing progress:', error);
              return;
            }
            console.log('Progress synced successfully');
          }

          // Clear local regardless
          localStorage.removeItem('noir_finished_exercises');
          localStorage.removeItem('noir_last_exercise');
          localStorage.removeItem('noir_theme');

          // Load final state
          await loadProgress();
        } catch (err) {
          console.error('Unexpected error syncing progress:', err);
        }
      })();
    }
  }, [user]);

  // Wrap the save logic in a debounced function
  useEffect(() => {
    const saveProgress = debounce(async () => {
      if (user) {
        try {
          const client = supabase();
          if (!client) {
            console.warn('Supabase client not available for progress saving');
            return;
          }
          const { error } = await client.from('user_progress').update({
            finished_exercises: finishedExercises.map(normalizePath),
            last_exercise: currentExercise,
            theme: theme,
          }).eq('user_id', user!.id);
          if (error) {
            console.error('Error saving progress:', error);
          } else {
            console.log('Progress saved successfully');
          }
        } catch (err) {
          console.error('Unexpected error saving progress:', err);
        }
      } else {
        localStorage.setItem("noir_finished_exercises", JSON.stringify(finishedExercises));
        if (currentExercise) localStorage.setItem("noir_last_exercise", currentExercise);
        localStorage.setItem("noir_theme", theme);
      }
    }, 500); // Debounce for 0.5 second

    saveProgress();

    return () => saveProgress.cancel(); // Cleanup on unmount
  }, [finishedExercises, currentExercise, theme, user]);

  // // Share text templates
  // const shareTemplates = [
  //   "Just smashed {finished}/{total} Noirlings exercises, bullish af ⚡️\n\nLevel up your Noir game here: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "{finished}/{total} Noirlings done, privacy arc started 🚀\n\nYour turn anon: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "Grinding Noirlings {finished}/{total}, gonna make it fr 🔥\n\nJoin the quest: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "{finished}/{total} Noirlings crushed! Ready to speedrun zk skills?\n\nHop in: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "{finished} outta {total} Noirlings exercises checked ✅\nNoir skills loading… \n\nGet your zk reps in here: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "I'm {finished}/{total} into Noirlings already, don't sleep anon 😴\n\nStart before your frens: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "Achievement unlocked: {finished}/{total} Noirlings 🕹️\n\nLevel up: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "{finished}/{total} done on Noirlings - can you beat me anon? 🎯\n\nShow your skillz: https://noirlings.app \n\n@NoirLang @andeebtceth",
  //   "Long on Noir, entry at {finished}/{total} Noirlings exercises 📈\n\nDYOR here: https://noirlings.app \n\n@NoirLang @andeebtceth",
  // ];

  // Enhanced mouse and touch event handlers for draggable separator
  useEffect(() => {
    let animationFrame: number | null = null;

    function handleMove(clientX: number) {
      // Minimum 300px, maximum 800px for info panel
      const min = 300;
      const max = 800;
      const newWidth = Math.min(Math.max(clientX, min), max);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setInfoPanelWidth(newWidth);
      });
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      handleMove(e.clientX);
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }

    function handleEnd() {
      setIsDragging(false);
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
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
          wordWrap: 'on',
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

  const handleExerciseSelect = async (exercisePath: string) => {
    try {
      // Save the selected exercise path to localStorage
      localStorage.setItem("noir_last_exercise", exercisePath);

      // Load exercise with new function
      const exerciseData = await loadExerciseData(exercisePath);
      setInitialExerciseContent(exerciseData.code);

      // Create file system with just the code
      const exerciseFile = createFileFromExercise(exercisePath, exerciseData.code);
      setFilesystem(new FileSystem(exerciseFile));

      // Set metadata separately
      setCurrentExercise(normalizePath(exercisePath));
      setCurrentExerciseTitle(exerciseData.metadata.title);
      setCurrentExerciseHint(exerciseData.metadata.hint);
      setCurrentExerciseDescription(exerciseData.metadata.description);
      setCurrentPath("src/main.nr");
      setOldPath(undefined);
      setShowHint(false); // Hide hint by default for each new exercise
      setCurrentDocLink(exerciseData.metadata.docLink);
    } catch (error) {
      console.error("Failed to load exercise:", error);
    }
  };

  // Auto-load the last or first exercise on initial mount
  useEffect(() => {
    let cancelled = false;
    async function loadInitialExercise() {
      try {
        const exercises = props.isAdvancedMode ? await getAdvancedExercises() : await getOrderedExercises();
        if (!exercises || exercises.length === 0) return;

        // Check if current exercise belongs to the current mode
        const currentCategory = currentExercise?.split('/')[0];
        const currentModeCategories = props.isAdvancedMode ? ADVANCED_CATEGORIES : BASIC_CATEGORIES;
        const currentExerciseInMode = currentCategory && currentModeCategories.includes(currentCategory);

        console.log('Mode switch check:', {
          isAdvancedMode: props.isAdvancedMode,
          currentExercise,
          currentCategory,
          currentModeCategories,
          currentExerciseInMode
        });

        // If current exercise doesn't belong to this mode, load first exercise of this mode
        if (!currentExerciseInMode) {
          const toLoad = exercises[0]; // Always load first exercise of the mode
          if (!cancelled && toLoad) {
            const exercisePath = `${toLoad.category}/${toLoad.id}`;
            console.log('Loading exercise for mode:', exercisePath);
            await handleExerciseSelect(exercisePath);
          }
        }
      } catch (e) {
        console.error('Error in loadInitialExercise:', e);
      }
    }
    loadInitialExercise();
    return () => { cancelled = true; };
  }, [props.isAdvancedMode, currentExercise]);

  // Add effect to persist finishedExercises
  useEffect(() => {
    localStorage.setItem("noir_finished_exercises", JSON.stringify(finishedExercises));
  }, [finishedExercises]);

  const handleCompileSuccess = () => {
    if (currentExercise && !finishedExercises.includes(currentExercise)) {
      setFinishedExercises((prev) => Array.from(new Set([...prev, currentExercise])));
    }
  };

  // Fetch and store exercises on mount (advanced or regular based on mode)
  useEffect(() => {
    let cancelled = false;
    async function fetchExercises() {
      try {
        const exercises = props.isAdvancedMode ? await getAdvancedExercises() : await getOrderedExercises();
        if (!cancelled) setOrderedExercises(exercises);
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchExercises();
    return () => { cancelled = true; };
  }, [props.isAdvancedMode]);

  // Compute current exercise index
  const currentExerciseIndex = orderedExercises.findIndex((ex: OrderedExercise) => `${ex.category}/${ex.id}` === normalizePath(currentExercise));

  // Navigation handlers
  const handleForward = () => {
    if (
      currentExerciseIndex !== -1 &&
      currentExerciseIndex < orderedExercises.length - 1
    ) {
      const next = orderedExercises[currentExerciseIndex + 1];
      if (next) {
        const exercisePath = `${next.category}/${next.id}`;
        handleExerciseSelect(exercisePath);
      }
    }
  };

  // Add handlers before return
  const handleCopy = async () => {
    if (monacoEditor) {
      await navigator.clipboard.writeText(monacoEditor.getValue());
      toast.success('Code copied to clipboard!');
    }
  };

  const handleReset = () => {
    if (!currentExercise || !initialExerciseContent || !monacoEditor) return;
    const exerciseFile = createFileFromExercise(currentExercise, initialExerciseContent);
    setFilesystem(new FileSystem(exerciseFile));
    monacoEditor.setValue(initialExerciseContent);
    setCodeInBuffer(initialExerciseContent);
    setShowHint(false);
    toast.success('Code reset to initial state!');
  };

  // Move compile function from ActionsBox
  const compile = async (project: FileSystem) => {
    setCompileError(null);
    setPending(true);
    try {
      const compiled = await compileCode(project);
      setCompiledCode(compiled);
      setCompileError(null);
      toast.success('Compiled!');
      if (currentExercise && !finishedExercises.includes(currentExercise)) {
        setFinishedExercises((prev) => Array.from(new Set([...prev, currentExercise])));
      }
    } catch (err: unknown) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setCompileError(message);
      setCompiledCode(null);
      toast.error(message);
      throw err;
    } finally {
      setPending(false);
    }
  };

  // Update handleRun to use the new compile
  const handleRun = async () => {
    await compile(fileSystem);
  };


  // Add useEffect to reset states when fileSystem changes (like in ActionsBox)
  useEffect(() => {
    setCompiledCode(null);
    setCompileError(null);
  }, [fileSystem]);


  const currentCategories = props.isAdvancedMode ? ADVANCED_CATEGORIES : BASIC_CATEGORIES;
  const currentFinished = finishedExercises.filter(ex => {
    const category = normalizePath(ex).split('/')[0];
    return currentCategories.includes(category);
  }).length;

  return (
    <div className="h-screen w-full flex flex-col">
      <Header 
        showProgress={true} 
        completedCount={currentFinished} 
        totalCount={orderedExercises.length} 
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Exercises sidebar */}
        <div
          className="border-r overflow-y-auto max-h-60 md:max-h-none relative"
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderColor: 'var(--border-color)',
            width: showExercisesSidebar ? 200 : 0,
            minWidth: showExercisesSidebar ? 200 : 0,
            transition: "width 0.3s ease-in-out",
            overflow: "hidden",
          }}
        >
          <div style={{ opacity: showExercisesSidebar ? 1 : 0, transition: "opacity 0.3s ease-in-out", width: 200, paddingTop: '0.5rem' }}>
            {props.isAdvancedMode ? (
              <AdvancedExercisesSidebar
                selectExercise={(path: string): void => {
                  void handleExerciseSelect(path);
                }}
                currentExercise={currentExercise}
                finishedExercises={finishedExercises}
              />
            ) : (
              <ExercisesSidebar
                selectExercise={(path: string): void => {
                  void handleExerciseSelect(path);
                }}
                currentExercise={currentExercise}
                finishedExercises={finishedExercises}
              />
            )}
          </div>
        </div>

        {/* Sidebar toggle button - positioned flush against right edge */}
        <div className="relative">
          <button
            onClick={toggleExercisesSidebar}
            className="absolute top-2 px-[0] py-4 rounded-r-md hover:opacity-80 transition-all duration-200 cursor-pointer z-20"
            style={{
              left: showExercisesSidebar ? '-1px' : '0px',
              backgroundColor: 'var(--bg-sidebar)',
              borderColor: 'var(--border-color)',
              border: '1px solid var(--border-color)',
              borderLeft: showExercisesSidebar ? 'none' : '1px solid var(--border-color)',
              color: 'var(--color-secondary)',
              transform: 'translateX(0)',
              borderRadius: '0 0.375rem 0.375rem 0',
            }}
            aria-label={showExercisesSidebar ? "Collapse sidebar" : "Expand sidebar"}
          >
            {showExercisesSidebar ? (
              <ChevronLeft size={16} color="var(--color-secondary)" />
            ) : (
              <ChevronRight size={16} color="var(--color-secondary)" />
            )}
          </button>
        </div>

        {/* Info Panel + Editor side by side */}
        <div className={`flex flex-1 flex-row min-h-0 transition-all duration-200 ease-in-out ${showExercisesSidebar ? 'w-[calc(100%-200px)]' : 'w-full'}`}>
          {/* Exercise Info Panel: only takes width if currentExercise is set */}
          {currentExercise ? (
            <div
              className="hidden md:flex flex-col border-r"
              style={{
                backgroundColor: 'var(--bg-sidebar)',
                borderColor: 'var(--border-color)',
                minWidth: 0,
                maxWidth: 800,
                width: infoPanelWidth,
                transition: isDragging ? "none" : "none",
                userSelect: isDragging ? "none" : "auto",
                cursor: isDragging ? "col-resize" : "default",
                maxHeight: "100vh",
                color: 'var(--color-primary)'
              }}
            >
              {/* Scrollable content area */}
              <div
                className="flex-1 overflow-y-auto"
                style={{ minHeight: 0 }}
              >
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      {currentExerciseTitle && formatExerciseName(currentExerciseTitle)}
                    </div>
                    <button
                      className="px-3 py-2 cursor-pointer transition-opacity border rounded hover:opacity-80 flex items-center gap-2"
                      style={{ borderColor: 'var(--border-color)', backgroundColor: 'transparent', color: 'var(--color-secondary)' }}
                      onClick={() => setShowHint((prev) => !prev)}
                    >
                      <Lightbulb size={16} color="var(--color-secondary)" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </button>

                  </div>
                  {currentExerciseDescription && (
                    <div style={{ color: 'var(--color-primary)' }} className="mb-6">
                      {/* <span className="font-bold">Description</span> */}
                      <div className="markdown-body">
                        <ReactMarkdown
                          components={{
                            code: (props) => <CodeBlock {...props} theme={theme} />
                          }}
                        >
                          {currentExerciseDescription}
                        </ReactMarkdown>
                      </div>
                      <div className="mt-3 break-words" style={{ borderColor: 'var(--border-color)' }}>
                        <span style={{ color: 'var(--color-primary)' }}>
                          <a href={currentDocLink || DEFAULT_DOC_URL} target="_blank" rel="noopener noreferrer" className="no-underline font-light" style={{ color: 'var(--color-accent)' }}>{currentDocLink || DEFAULT_DOC_URL}</a>
                        </span>
                      </div>
                    </div>
                  )}

                  {currentExerciseHint && showHint && (
                    <div className="whitespace-pre-line rounded flex flex-col gap-2" style={{ color: 'var(--color-secondary)' }}>
                      <span className="font-bold text-base" >Hint</span>
                      <div className="markdown-body markdown-body-hint">
                        <ReactMarkdown
                          components={{
                            code: (props) => <CodeBlock {...props} theme={theme} />
                          }}
                        >
                          {currentExerciseHint.trim() !== "No hint this time" ? currentExerciseHint : ""}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed bottom ActionsBox - Compilation only, no proof generation */}
              {loaded && (
                <div className="flex-shrink-0 mt-4">
                  <ActionsBox
                    project={fileSystem}
                    onCompileSuccess={handleCompileSuccess}
                    onForward={
                      currentExerciseIndex !== -1 && currentExerciseIndex < orderedExercises.length - 1
                        ? handleForward
                        : undefined
                    }
                    compiledCode={compiledCode}
                    compileError={compileError}
                    pending={pending}
                    compile={compile}
                  />
                </div>
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
                "flex h-full select-none group"
              }
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  setInfoPanelWidth((prev) => Math.max(300, prev - 10));
                } else if (e.key === 'ArrowRight') {
                  setInfoPanelWidth((prev) => Math.min(800, prev + 10));
                }
              }}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize exercise info panel (use arrow keys for precise control)"
              aria-valuemin={300}
              aria-valuemax={800}
              aria-valuenow={infoPanelWidth}
              tabIndex={0}
              style={{
                width: 8, // Wider for easier grabbing
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
              {/* Visible handle: vertical grip */}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 24,
                  background:
                    `repeating-linear-gradient(to bottom, var(--color-accent), var(--color-accent) 2px, transparent 2px, transparent 6px)`,
                }}
                className={
                  isDragging
                    ? "opacity-100"
                    : "opacity-50 group-hover:opacity-100 transition-opacity"
                }
              />
            </div>
          )}

          {/* Editor area */}
          <div
            className={`flex-1 flex flex-col min-h-0 box-border text-sm font-fira-code w-full h-auto`}
            id="noir__editor"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              minWidth: 0,
              transition: isDragging ? "none" : "width 0.15s",
              userSelect: isDragging ? "none" : "auto",
            }}
          >
            <div className="px-4 py-4 gap-4 flex justify-end items-center" style={{ backgroundColor: 'var(--monaco-editor-bg)' }}>
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
              <div className="relative">
                <button
                  onClick={() => {
                    handleReset();
                    setResetTooltip({ visible: true, text: 'Reset!', isClicked: true });
                    setTimeout(() => setResetTooltip({ visible: false, text: 'Reset', isClicked: false }), 500);
                  }}
                  onMouseEnter={() => setResetTooltip({ visible: true, text: 'Reset', isClicked: false })}
                  onMouseLeave={() => {
                    if (!resetTooltip.isClicked) {
                      setResetTooltip(prev => ({ ...prev, visible: false }));
                    }
                  }}
                  className="cursor-pointer hover:opacity-80 transition-all duration-200 bg-transparent border-none"
                  aria-label="Reset code"
                >
                  <RotateCcw size={18} color="var(--color-secondary)" />
                </button>
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 z-50 ${resetTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{ backgroundColor: 'var(--bg-toolbar)', color: 'var(--header-text)' }}
                >
                  {resetTooltip.text}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    handleRun();
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
                >
                  <Play size={18} color="var(--color-secondary)" />
                </button>
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 z-50 ${compileTooltip.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{ backgroundColor: 'var(--bg-toolbar)', color: 'var(--header-text)' }}
                >
                  {compileTooltip.text}
                </span>
              </div>
            </div>
            <section className="flex-1 min-h-0 w-full">
              <div ref={editorRef} id="editor" className="w-full h-64 md:h-full min-h-0 flex-1" style={{ minHeight: 0 }}></div>
            </section>

          </div>
        </div>
      </div>
    </div >
  );
}

export default NoirEditor;
