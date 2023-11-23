import React from "react";
import { ProofData } from "@noir-lang/types";
import {
  ProofDataContainer,
  ResultsContainer,
  TextProofContainer,
} from "./result.styles";
import { StyledButton, BackButton } from "../../globals/buttons.styles";
import { StyledHeader } from "../../globals/text.styles";
import { toast } from "react-toastify";

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
    <ResultsContainer>
      <ProofDataContainer>
        <StyledHeader>Proof</StyledHeader>
        <TextProofContainer>{proof.proof.toString()}</TextProofContainer>
        <StyledButton
          fullWidth={true}
          primary={true}
          onClick={() => copyToClipboard(proof.proof)}
        >
          Copy to clipboard
        </StyledButton>
      </ProofDataContainer>
      <ProofDataContainer>
        <StyledHeader>Public Inputs</StyledHeader>
        <TextProofContainer>{proof.publicInputs.toString()}</TextProofContainer>
        <StyledButton
          fullWidth={true}
          primary={true}
          onClick={() =>
            copyToClipboard(
              proof.publicInputs.reduce((acc, curr) =>
                Uint8Array.from([...acc, ...curr]),
              ),
            )
          }
        >
          Copy to clipboard
        </StyledButton>
        <BackButton
          fullWidth={true}
          primary={true}
          onClick={() => setProof(null)}
        >
          Back
        </BackButton>
      </ProofDataContainer>
    </ResultsContainer>
  );
};
