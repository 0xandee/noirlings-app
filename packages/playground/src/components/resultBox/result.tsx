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
      <div className="flex-col flex flex-1 min-w-[250px]">
        <form
          onSubmit={() => copyToClipboard([proof.proof])}
          className="flex flex-col flex-1 p-6"
        >
          <h3 className="text-lg leading-6 font-medium" style={{ color: 'var(--color-primary)' }}>Proof</h3>
          <div
            className="border h-40 overflow-hidden text-xs p-2 overflow-ellipsis line-clamp-2 break-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--color-secondary)'
            }}
          >
            {proof.proof.toString()}
          </div>
          <ButtonContainer>
            <Button
              type="submit"
              $primary={true}
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-accent)'
              }}
            >
              Copy to clipboard
            </Button>
          </ButtonContainer>
        </form>
      </div>
      <form
        className="flex flex-col flex-1 p-6 min-w-[250px]"
        onSubmit={() => copyToClipboard(proof.publicInputs)}
      >
        <h3 className="text-lg leading-6 font-medium" style={{ color: 'var(--color-primary)' }}>
          Public Inputs
        </h3>
        <div
          className="border h-40 overflow-hidden text-xs p-2 overflow-ellipsis line-clamp-2 break-all"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--color-secondary)'
          }}
        >
          {proof.publicInputs.toString()}
        </div>
        <ButtonContainer>
          <Button
            type="submit"
            $primary={true}
            style={{
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-accent)'
            }}
          >
            Copy to clipboard
          </Button>
        </ButtonContainer>
      </form>

      <BackButtonContainer>
        <BackButton
          onClick={() => setProof(null)}
          style={{
            color: 'var(--color-primary)'
          }}
        >
          Back
        </BackButton>
      </BackButtonContainer>
    </>
  );
};
