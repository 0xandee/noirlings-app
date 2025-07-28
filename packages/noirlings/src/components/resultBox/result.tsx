import React, { useState } from "react";
import { ProofData } from "../../types";
import { CompiledCircuit } from "@noir-lang/types";
import { toast } from "react-toastify";
import { Button, BackButton } from "../buttons/buttons";
import { Download, Copy, FileText, Check, Shield, ShieldCheck, AlertCircle } from "lucide-react";
import { verifyProof } from "../../utils/generateProof";

export const ResultBox = ({
  proof,
  setProof,
  compiledCode
}: {
  proof: ProofData;
  setProof: React.Dispatch<React.SetStateAction<ProofData | null>>;
  compiledCode?: CompiledCircuit | null;
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const copyToClipboard = async (item: string | string[], label: string) => {
    const text = Array.isArray(item) ? item.join('\n') : item;
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const downloadAsFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const downloadProof = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAsFile(proof.proof, `noir_proof_${timestamp}.txt`);
  };

  const downloadPublicInputs = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const content = proof.publicInputs.join('\n');
    downloadAsFile(content, `noir_public_inputs_${timestamp}.txt`);
  };

  const downloadAll = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const content = JSON.stringify({
      proof: proof.proof,
      publicInputs: proof.publicInputs,
      timestamp: new Date().toISOString()
    }, null, 2);
    downloadAsFile(content, `noir_proof_bundle_${timestamp}.json`, 'application/json');
  };

  const handleVerifyProof = async () => {
    if (!compiledCode) {
      toast.error("No compiled circuit available for verification");
      return;
    }

    setVerifying(true);
    try {
      // Convert proof string back to Uint8Array
      const proofArray = new Uint8Array(proof.proof.split(',').map(x => parseInt(x.trim())));
      
      const isValid = await verifyProof({
        circuit: compiledCode,
        proof: proofArray,
        publicInputs: proof.publicInputs,
      });
      
      setVerificationResult(isValid);
      toast.success(isValid ? "Proof verified successfully!" : "Proof verification failed!");
    } catch (error: any) {
      console.error('Verification failed:', error);
      setVerificationResult(false);
      toast.error(`Verification error: ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header with success message */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full" 
            style={{ backgroundColor: 'var(--color-accent)' }}>
            <Check className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>
              Proof Generated Successfully!
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>
              Your zero-knowledge proof is ready for export
            </p>
          </div>
        </div>
        <BackButton
          onClick={() => setProof(null)}
          style={{ color: 'var(--color-primary)' }}
        >
          Back to Editor
        </BackButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proof Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
            Zero-Knowledge Proof
          </h3>
          <div
            className="border rounded-lg p-4 h-40 overflow-y-auto text-xs font-mono break-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--color-secondary)'
            }}
          >
            {proof.proof}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(proof.proof, "Proof")}
              className="flex items-center gap-2 flex-1"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-toolbar)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button
              onClick={downloadProof}
              className="flex items-center gap-2 flex-1"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-accent)'
              }}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        {/* Public Inputs Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
            Public Inputs
          </h3>
          <div
            className="border rounded-lg p-4 h-40 overflow-y-auto text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--color-secondary)'
            }}
          >
            {proof.publicInputs.length > 0 ? (
              proof.publicInputs.map((input, index) => (
                <div key={index} className="mb-1">
                  {input}
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--color-secondary)' }}>No public inputs</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(proof.publicInputs, "Public inputs")}
              className="flex items-center gap-2 flex-1"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--bg-toolbar)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button
              onClick={downloadPublicInputs}
              className="flex items-center gap-2 flex-1"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-accent)'
              }}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      {compiledCode && (
        <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
            Proof Verification
          </h3>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleVerifyProof}
              disabled={verifying}
              className="flex items-center gap-2 px-4 py-2"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: verificationResult === null ? 'var(--bg-toolbar)' : 
                  verificationResult ? '#4ADE80' : '#FA5E5E',
                border: '1px solid var(--border-color)'
              }}
            >
              {verifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Verifying...
                </>
              ) : verificationResult === null ? (
                <>
                  <Shield className="w-4 h-4" />
                  Verify Proof
                </>
              ) : verificationResult ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verified ✓
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  Verification Failed
                </>
              )}
            </Button>
            
            {verificationResult !== null && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${verificationResult ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span style={{ color: verificationResult ? '#4ADE80' : '#FA5E5E' }}>
                  {verificationResult ? 'Proof is valid' : 'Proof is invalid'}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
            Verification checks that the proof was generated correctly using the compiled circuit and public inputs.
          </p>
        </div>
      )}

      {/* Export All Section */}
      <div className="flex flex-col items-center space-y-4 pt-4 border-t" 
        style={{ borderColor: 'var(--border-color)' }}>
        <Button
          onClick={downloadAll}
          className="flex items-center gap-2 px-6 py-3"
          style={{
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-accent)',
            fontSize: '16px'
          }}
        >
          <FileText className="w-5 h-5" />
          Download Complete Proof Bundle (JSON)
        </Button>
        <p className="text-xs text-center max-w-md" style={{ color: 'var(--color-secondary)' }}>
          The complete bundle includes both the proof and public inputs in a structured JSON format, 
          perfect for verification or integration with other systems.
        </p>
      </div>
    </div>
  );
};
