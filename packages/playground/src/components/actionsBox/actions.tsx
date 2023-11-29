import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { RenderInputs } from "../inputs/inputs";
import { compileCode, generateProof } from "../../utils/generateProof";
import { prepareInputs } from "../../utils/serializeParams";
import { shareSnippet } from "../../utils/shareSnippet";
import { toast } from "react-toastify";
import { ProofData, CompiledCircuit } from "@noir-lang/types";
import { useParams } from "../../hooks/useParams";
import { InputMap } from "@noir-lang/noirc_abi";
import { Button } from "../buttons/buttons";
import { ButtonContainer } from "../buttons/containers";
import { NoirProps, PlaygroundProps } from "src/types";

export const ActionsBox = ({
  code,
  props,
  setProof,
}: {
  code: string;
  props: PlaygroundProps;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
}) => {
  const [pending, setPending] = useState<boolean>(false);
  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(
    null,
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
  }, [code]);

  const compile = async (code: string | undefined) => {
    const compiledCode = await compileCode(code);
    setCompiledCode(compiledCode);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const compileTO = new Promise((resolve, reject) =>
      setTimeout(async () => {
        try {
          setPending(false);
          await compile(code);
          resolve(code);
        } catch (err) {
          reject(err);
        }
      }, 100),
    );

    await toast.promise(compileTO, {
      pending: "Compiling...",
      success: "Compiled!",
      error: "Error compiling",
    });
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
      },
    );
    setProof(proofData);
    setPending(false);
  };

  const share = async (e: FormEvent) => {
    e.preventDefault();
    if (code) {
      await toast.promise(shareSnippet({ code, baseUrl: props.baseUrl }), {
        pending: "Copying to clipboard...",
        success: "Copied!",
        error: "Error sharing",
      });
    }
  };

  useEffect(() => {
    console.log(inputs)
  }, [inputs])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange, ...htmlProps } = props;
  return (
    <div className="w-full bg-white shadow sm:rounded-lg flex flex-auto flex-wrap">
      {params && (
        <div className="px-4 py-5 sm:p-6 flex flex-col flex-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Inputs</h3>
          <form onSubmit={(e) => prove(e)} className="flex-col mt-5 sm:flex sm:items-center" id="inputs-container">
            <div className="sm:max-w-xs flex flex-auto flex-col w-full" id="inputs-container">
              <RenderInputs
                params={params}
                inputs={inputs}
                handleInput={handleInput}
              />
            </div>
            <ButtonContainer>
              <Button
                type="submit"
                disabled={pending} $primary={true}
              >
                📜 Prove
              </Button>
            </ButtonContainer>
          </form>
        </div>
      )}
      <form {...htmlProps} className="flex flex-auto flex-col justify-center" onSubmit={(e) => submit(e)}>
        <input type="text" style={{ display: "none" }} />
        <ButtonContainer>
          <Button type="submit" disabled={pending} $primary={true}>
            🔄 Compile
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
    </div>
  );
};
