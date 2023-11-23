import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { RenderInputs } from "../inputs/inputs";
import { compileCode, generateProof } from "../../utils/generateProof";
import { prepareInputs } from "../../utils/serializeParams";
import { shareSnippet } from "../../utils/shareSnippet";
import { toast } from "react-toastify";
import { ProofData, CompiledCircuit } from "@noir-lang/types";
import { useParams } from "../../hooks/useParams";
import { InputMap } from "@noir-lang/noirc_abi";
import { NoirEditorProps } from "../../types";
import { ButtonContainer, StyledButton } from "../../globals/buttons.styles";
import {
  ActionsContainer,
  ParamsForm,
  InputsContainer,
  ButtonsForm,
} from "./actions.styles";

export const ActionsBox = ({
  code,
  props,
  setProof,
}: {
  code: string;
  props: NoirEditorProps;
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
    console.log("sub");
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
        threads: props.threads ?? navigator.hardwareConcurrency,
      }),
      {
        pending: "Calculating proof...",
        success: "Proof calculated!",
        error: "Error calculating proof",
      },
    );
    setProof(proofData);
    setPending(true);
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

  return (
    <ActionsContainer {...props}>
      <ButtonsForm onSubmit={(e) => submit(e)}>
        <input type="text" style={{ display: "none" }} />
        <ButtonContainer column={!!params}>
          <StyledButton type="submit" disabled={pending} primary={true}>
            🔄 Compile
          </StyledButton>
          <StyledButton onClick={(e) => share(e)} disabled={pending}>
            ✉️ Share
          </StyledButton>
        </ButtonContainer>
      </ButtonsForm>
      {params && (
        <ParamsForm onSubmit={(e) => prove(e)}>
          <InputsContainer>
            <ButtonContainer>
              <StyledButton type="submit" disabled={pending} primary={true}>
                📜 Prove
              </StyledButton>
            </ButtonContainer>
          </InputsContainer>
          <InputsContainer id="inputs-container">
            <RenderInputs
              params={params}
              inputs={inputs}
              handleInput={handleInput}
            />
          </InputsContainer>
        </ParamsForm>
      )}
    </ActionsContainer>
  );
};
