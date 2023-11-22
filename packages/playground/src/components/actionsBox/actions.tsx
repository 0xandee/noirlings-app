import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ActionsContainer,
  InnerButtonContainer,
  StyledButton,
  ParamsContainer,
  InputsContainer,
} from "../editor/NoirEditor.styles";
import { RenderInputs } from "../inputs/inputs";
import { compileCode, generateProof } from "../../utils/generateProof";
import { prepareInputs } from "../../utils/serializeParams";
import { shareSnippet } from "../../utils/shareSnippet";
import { toast } from "react-toastify";
import { ProofData, CompiledCircuit } from "@noir-lang/types";
import { useParams } from "../../hooks/useParams";
import { InputMap } from "@noir-lang/noirc_abi";
import { NoirEditorProps } from "../../types";

export const ActionsBox = ({
  code,
  props,
}: {
  code: string;
  props: NoirEditorProps;
}) => {
  console.log(props);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  const [compiledCode, setCompiledCode] = useState<CompiledCircuit | null>(
    null,
  );
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

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

  const params = useParams({ compiledCode });

  const submit = async () => {
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

  const compile = async (code: string | undefined) => {
    const compiledCode = await compileCode(code);
    setCompiledCode(compiledCode);
  };

  const prove = async () => {
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
    console.log(proof);
  };

  const share = async () => {
    if (code) {
      await shareSnippet({ code, baseUrl: props.baseUrl });
      toast.success("Copied to clipboard");
    }
  };

  return (
    <ActionsContainer {...props}>
      <InnerButtonContainer>
        <StyledButton onClick={() => submit()} disabled={pending}>
          🔄 Compile
        </StyledButton>
        <StyledButton onClick={() => share()} disabled={pending}>
          ✉️ Share
        </StyledButton>
      </InnerButtonContainer>
      {params && (
        <ParamsContainer>
          <InputsContainer id="inputs-container">
            <RenderInputs
              params={params}
              inputs={inputs}
              handleInput={handleInput}
            />
          </InputsContainer>
          <InnerButtonContainer>
            <StyledButton onClick={() => prove()} disabled={pending}>
              📜 Prove
            </StyledButton>
          </InnerButtonContainer>
        </ParamsContainer>
      )}
    </ActionsContainer>
  );
};
