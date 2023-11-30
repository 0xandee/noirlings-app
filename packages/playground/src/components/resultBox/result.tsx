import React from "react";
import { ProofData } from "../../types";
import { toast } from "react-toastify";
import { Button, BackButton } from "../buttons/buttons";
import { BackButtonContainer, ButtonContainer } from "../buttons/containers";

export const ResultBox = ({
  proof,
  setProof,
}: {
  proof: ProofData;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
}) => {
  const copyToClipboard = async (item: string[]) => {
    await navigator.clipboard.writeText(item.toString());
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <div className="flex-col flex flex-1  min-w-[250px]">
        <form
          onSubmit={() => copyToClipboard([proof.proof])}
          className="flex flex-col flex-1 p-6"
        >
          <h3 className="text-lg leading-6 font-medium text-gray-900">Proof</h3>
          <div className="border bg-yellow-7 border-gray-400 h-40 overflow-hidden text-gray-600 text-xs p-2 overflow-ellipsis line-clamp-2 break-all">
            {proof.proof.toString()}
          </div>
          <ButtonContainer>
            <Button type="submit" $primary={true}>
              Copy to clipboard
            </Button>
          </ButtonContainer>
        </form>
      </div>
      <form
        className="flex flex-col flex-1 p-6 min-w-[250px]"
        onSubmit={() => copyToClipboard(proof.publicInputs)}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Public Inputs
        </h3>
        <div className="border bg-yellow-7 border-gray-400 h-40 overflow-hidden text-gray-600 text-xs p-2 overflow-ellipsis line-clamp-2 break-all">
          {proof.publicInputs.toString()}
        </div>
        <ButtonContainer>
          <Button type="submit" $primary={true}>
            Copy to clipboard
          </Button>
        </ButtonContainer>
      </form>

      <BackButtonContainer>
        <BackButton onClick={() => setProof(null)}>Back</BackButton>
      </BackButtonContainer>
    </>
  );
};
