import React, { FormEvent, useEffect, useState } from "react";

import { compileCode, generateProof } from "../../utils/generateProof";
import { prepareInputs } from "../../utils/serializeParams";
import { toast } from "react-toastify";
import { CompiledCircuit } from "@noir-lang/types";
import { useParams } from "../../hooks/useParams";
import { InputMap } from "@noir-lang/noirc_abi";
import { Button } from "../buttons/buttons";
import { ButtonContainer } from "../buttons/containers";
import { NoirProps, PlaygroundProps, ProofData } from "../../types";
import { toHex } from "../../utils/toHex";
import { FileSystem } from "../../utils/fileSystem";

export const ActionsBox = ({
  project,
  props,
  setProof,
  onCompileSuccess,
  onBack,
  onForward,
}: {
  project: FileSystem;
  props: PlaygroundProps;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
  onCompileSuccess?: () => void;
  onBack?: () => void;
  onForward?: () => void;
}) => {
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(
    null
  );
  const [pending, setPending] = useState<boolean>(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  const params = useParams({ compiledCode });

  useEffect(() => {
    setCompiledCode(null);
    setCompileError(null);
  }, [project]);

  const compile = async (project: FileSystem) => {
    setCompileError(null);
    try {
      const compiledCode = await compileCode(project);
      setCompiledCode(compiledCode);
      setCompileError(null);
    } catch (err: unknown) {
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      setCompileError(message);
      setCompiledCode(null);
      throw err;
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!compiledCode) {
      setPending(true);
      setCompileError(null);
      try {
        await toast.promise(compile(project), {
          pending: "Compiling...",
          success: "Compiled!",
          error: { render: ({ data }) => `${data}` },
        });
        if (onCompileSuccess) onCompileSuccess();
      } finally {
        setPending(false);
      }
    } else {
      await prove(e);
    }
  };

  const prove = async (e: FormEvent) => {
    e.preventDefault();
    const inputMap = prepareInputs(params!, {});
    const proofData = await toast.promise(
      generateProof({
        circuit: compiledCode!,
        input: inputMap as InputMap,
        threads: (props as NoirProps).threads ?? navigator.hardwareConcurrency,
      }),
      {
        pending: "Calculating proof...",
        success: "Proof calculated!",
        error: "Error calculating proof",
      }
    );

    const proofDataHex = {
      proof: toHex(proofData.proof),
      publicInputs: Array.from(proofData.publicInputs.values()),
    };
    setProof(proofDataHex);
  };

  return (
    <>
      <form
        className="flex flex-auto flex-col justify-end"
        onSubmit={(e) => submit(e)}
      >
        <ButtonContainer>
          {compiledCode && (
            <div className="font-semibold mb-2 px-4" style={{ color: '#4ade80' }}>✨ Compiled successfully!</div>
          )}
          {compileError && (
            <div className="font-semibold mb-2 px-4" style={{ color: '#ef4444' }}>
              <span className="font-normal">Error:</span><br />
              <span className="font-normal">{compileError}</span>
            </div>
          )}
          <div className="w-full flex flex-row justify-between items-center">
            <Button
              type="button"
              $primary={false}
              className="cursor-pointer w-1/12"
              disabled={pending}
              onClick={onBack}
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-toolbar-btn)',
                opacity: onBack ? 1 : 0.5
              }}
            >
              ←
            </Button>
            <Button
              type="button"
              $primary={false}
              className="cursor-pointer w-1/12"
              disabled={pending}
              onClick={onForward}
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-toolbar-btn)',
                opacity: onForward ? 1 : 0.5
              }}
            >
              →
            </Button>
            <Button
              type="submit"
              $primary={true}
              className="cursor-pointer w-10/12"
              disabled={pending}
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-accent)'
              }}
            >
              {pending ? "Compiling..." : "Compile"}
            </Button>
          </div>
        </ButtonContainer>
      </form>
    </>
  );
};
