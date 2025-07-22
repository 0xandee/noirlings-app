import { CompiledCircuit } from "@noir-lang/types";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { InputMap } from "@noir-lang/noirc_abi";

import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { FileSystem } from "./fileSystem";
import { decodeSnippet } from "./shareSnippet";

const stringToStream = (data: string) => {
  return new Response(data).body as ReadableStream<Uint8Array>;
};

export const compileCode = async (fileSystem: FileSystem) => {
  console.log("Starting compilation...");
  const fm = createFileManager("/");

  try {
    // Write all files to the file manager
    const files = fileSystem.flatten().filter((item) => item.type === "file");
    console.log("Writing files:", files.map(f => f.name));
    
    for (const file of files) {
      const data = decodeSnippet(file.content as string);
      await fm.writeFile(`./${file.name}`, stringToStream(data));
    }

    console.log("Compiling circuit...");
    const compiled = await compile(fm, "/root");
    
    // Enhanced error checking
    if (!compiled) {
      throw new Error("Compilation failed: No result returned");
    }
    
    if (!("program" in compiled)) {
      // Check if there are compilation errors
      if ("errors" in compiled && (compiled as any).errors) {
        const errors = (compiled as any).errors;
        const errorMessages = Array.isArray(errors) 
          ? errors.map((err: any) => err.message || err.toString()).join('\n')
          : errors.toString();
        throw new Error(`Compilation errors:\n${errorMessages}`);
      }
      throw new Error("Compilation failed: Invalid compilation result");
    }

    console.log("Compilation successful");
    return compiled.program as CompiledCircuit;
  } catch (error) {
    console.error("Compilation error:", error);
    
    // Enhanced error message formatting
    if (error instanceof Error) {
      // Clean up common error patterns
      let message = error.message;
      
      // Format Noir compiler errors
      if (message.includes("error:") || message.includes("Error:")) {
        message = message.replace(/^error:\s*/i, "").trim();
      }
      
      // Add context for common errors
      if (message.includes("undefined variable")) {
        message += "\n\nTip: Make sure all variables are declared before use.";
      } else if (message.includes("type mismatch") || message.includes("expected")) {
        message += "\n\nTip: Check that all types match the function signatures.";
      } else if (message.includes("syntax error")) {
        message += "\n\nTip: Check for missing semicolons, brackets, or other syntax issues.";
      }
      
      throw new Error(message);
    }
    
    throw error;
  }
};

export async function generateProof({
  circuit,
  input,
  threads,
}: {
  circuit: CompiledCircuit;
  input: InputMap;
  threads: number;
}) {
  try {
    console.log("Initializing Noir circuit...");
    const noir = new Noir(circuit);
    const backend = new BarretenbergBackend(circuit as any, { threads });

    console.log("Executing circuit with inputs:", input);
    const { witness } = await noir.execute(input);
    
    console.log("Generating proof...");
    const proof = await backend.generateProof(witness);
    
    console.log("Proof generation successful");
    return proof;
  } catch (error) {
    console.error("Proof generation error:", error);
    
    if (error instanceof Error) {
      let message = error.message;
      
      // Add helpful tips for common proof generation errors
      if (message.includes("execution error") || message.includes("constraint")) {
        message += "\n\nTip: Check that your circuit logic is correct and all constraints are satisfied.";
      } else if (message.includes("input") || message.includes("parameter")) {
        message += "\n\nTip: Verify that all required inputs are provided and have correct types.";
      } else if (message.includes("witness")) {
        message += "\n\nTip: The circuit execution failed. Check your logic and input values.";
      } else if (message.includes("backend") || message.includes("barretenberg")) {
        message += "\n\nTip: Backend error occurred. Try reducing the number of threads or simplifying the circuit.";
      }
      
      throw new Error(`Proof generation failed: ${message}`);
    }
    
    throw new Error(`Proof generation failed: ${error}`);
  }
}

export async function verifyProof({
  circuit,
  proof,
  publicInputs,
  threads,
}: {
  circuit: CompiledCircuit;
  proof: Uint8Array;
  publicInputs: string[];
  threads: number;
}) {
  try {
    console.log("Initializing backend for verification...");
    const backend = new BarretenbergBackend(circuit as any, { threads });
    
    // Convert public inputs to the format expected by the backend
    console.log("Formatting public inputs for verification:", publicInputs);
    const formattedPublicInputs = publicInputs.map(input => input);
    
    console.log("Verifying proof...");
    const isValid = await backend.verifyProof({
      proof,
      publicInputs: formattedPublicInputs
    });

    console.log("Verification result:", isValid);
    return isValid;
  } catch (error) {
    console.error("Verification error:", error);
    
    if (error instanceof Error) {
      let message = error.message;
      
      // Add helpful tips for common verification errors
      if (message.includes("proof") && message.includes("invalid")) {
        message += "\n\nTip: The proof format may be incorrect or corrupted.";
      } else if (message.includes("public inputs") || message.includes("inputs")) {
        message += "\n\nTip: Check that the public inputs match those used during proof generation.";
      } else if (message.includes("circuit")) {
        message += "\n\nTip: Ensure you're using the same circuit that generated the proof.";
      }
      
      throw new Error(`Verification failed: ${message}`);
    }
    
    throw new Error(`Verification failed: ${error}`);
  }
}
