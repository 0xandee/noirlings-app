import React, { ReactNode } from "react";
import { ProofData } from "@noir-lang/types";
import { toast } from "react-toastify";
import {
  ProofDataContainer,
  ResultsContainer,
  TextProofContainer,
} from "./containers";
import { Button, BackButton } from "../buttons/buttons";
import { BackButtonContainer } from "../buttons/containers";

const StyledHeader = ({ children }: { children: ReactNode }) => (
  <h1 className="text-black text-lg">{children}</h1>
);

export const ResultBox = ({
  proof,
  setProof,
}: {
  proof: ProofData;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
}) => {
  const copyToClipboard = async (item: Uint8Array) => {
    await navigator.clipboard.writeText(item.toString());
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <ResultsContainer>
        <ProofDataContainer>
          <StyledHeader>Proof</StyledHeader>
          <TextProofContainer>{proof.proof.toString()}</TextProofContainer>
          <Button $primary={true} onClick={() => copyToClipboard(proof.proof)}>
            Copy to clipboard
          </Button>
        </ProofDataContainer>
        <ProofDataContainer>
          <StyledHeader>Public Inputs</StyledHeader>
          <TextProofContainer>
            {proof.publicInputs.toString()}
          </TextProofContainer>
          <Button
            $primary={true}
            onClick={() =>
              copyToClipboard(
                proof.publicInputs.reduce((acc, curr) =>
                  Uint8Array.from([...acc, ...curr]),
                ),
              )
            }
          >
            Copy to clipboard
          </Button>
        </ProofDataContainer>
      </ResultsContainer>

      <BackButtonContainer>
        <BackButton $primary={true} onClick={() => setProof(null)}>
          Back
        </BackButton>
      </BackButtonContainer>
    </>
  );
};
