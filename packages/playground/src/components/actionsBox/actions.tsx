import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { RenderInputs } from "../inputs/inputs";
import { compileCode, generateProof } from "../../utils/generateProof";
import { prepareInputs } from "../../utils/serializeParams";
import { shareProject } from "../../utils/shareSnippet";
import { toast } from "react-toastify";
import { CompiledCircuit } from "@noir-lang/types";
import { useParams } from "../../hooks/useParams";
import { InputMap } from "@noir-lang/noirc_abi";
import { flattenPublicInputs } from "@noir-lang/backend_barretenberg";
import { Button } from "../buttons/buttons";
import { ButtonContainer } from "../buttons/containers";
import { NoirProps, PlaygroundProps, ProofData } from "../../types";
import { toHex } from "../../utils/toHex";
import { FileSystem } from "../../utils/fileSystem";

export const ActionsBox = ({
  project,
  props,
  setProof,
}: {
  project: FileSystem;
  props: PlaygroundProps;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
}) => {
  const [pending, setPending] = useState<boolean>(false);
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(
    null
  );
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  const params = useParams({ compiledCode });

  const handleInput = ({
    event,
    key,
  }: {
    event: ChangeEvent<HTMLInputElement>;
    key: string;
  }) => {
    event.preventDefault();
    setInputs({ ...inputs, [key]: event.target.value });
  };

  useEffect(() => {
    setCompiledCode(null);
  }, [project]);

  const compile = async (project: FileSystem) => {
    const compiledCode = await compileCode(project);
    setCompiledCode(compiledCode);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!compiledCode) {
      setPending(true);

      await toast.promise(compile(project), {
        pending: "Compiling...",
        success: "Compiled!",
        error: { render: ({ data }) => `${data}` },
      });
    } else {
      await prove(e);
    }
    setPending(false);
  };

  const prove = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const inputMap = prepareInputs(params!, inputs);
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
<<<<<<< HEAD
      publicInputs: Array.from(proofData.publicInputs.values()),
=======
      publicInputs: flattenPublicInputs(proofData.publicInputs),
>>>>>>> origin
    };
    setProof(proofDataHex);
    setPending(false);
  };

  const share = async (e: FormEvent) => {
    e.preventDefault();
    if (project) {
      await toast.promise(shareProject({ project, baseUrl: props.baseUrl }), {
        pending: "Copying to clipboard...",
        success: "Copied!",
        error: "Error sharing",
      });
    }
  };

  return (
    <>
      {params && (
        <div className="px-4 py-5 sm:p-6 flex flex-col flex-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Inputs
          </h3>
          <form
            className="flex-col mt-5 sm:flex sm:items-center"
            id="inputs-container"
          >
            <div
              className="sm:max-w-xs flex flex-auto flex-col w-full"
              id="inputs-container"
            >
              <RenderInputs
                params={params}
                inputs={inputs}
                handleInput={handleInput}
              />
            </div>
          </form>
        </div>
      )}
      <form
        className="flex flex-auto flex-col justify-center"
        onSubmit={(e) => submit(e)}
      >
        <input type="text" style={{ display: "none" }} />
        <ButtonContainer>
          <Button type="submit" disabled={pending} $primary={true}>
            {compiledCode ? "📜 Prove" : "🔄 Compile"}
          </Button>
          <Button
            onClick={(e: FormEvent) => share(e)}
            disabled={pending}
            $primary={undefined}
          >
            ✉️ Share
          </Button>
        </ButtonContainer>
      </form>
    </>
  );
};
