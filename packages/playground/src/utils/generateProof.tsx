import { CompiledCircuit, InputMap } from "@noir-lang/types";
import { BarretenbergBackend, BarretenbergVerifier } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";

import { compile, createFileManager } from "@noir-lang/noir_wasm";
import { FileSystem } from "./fileSystem";
import { decodeSnippet } from "./shareSnippet";

const stringToStream = (data: string) => {
  return new Response(data).body as ReadableStream<Uint8Array>;
};

export const compileCode = async (fileSystem: FileSystem) => {
  console.log("Starting compilation...");
  // Create a fresh FileManager for each compilation to avoid file accumulation
  const fm = createFileManager("/");

  try {
    // Create Nargo.toml for newer Noir versions (they expect it to exist)
    const nargoToml = `[package]
name = "playground"
type = "bin"
authors = [""]

[dependencies]`;
    
    console.log("Writing Nargo.toml...");
    await fm.writeFile("Nargo.toml", stringToStream(nargoToml));
    
    // Process files from the file system
    const files = fileSystem.flatten().filter((item) => item.type === "file");
    console.log("Writing files:", files.map(f => f.name));
    
    for (const file of files) {
      let data: string;
      try {
        // Try to decode the content first (in case it's encoded like examples)
        data = decodeSnippet(file.content as string);
      } catch {
        // If decoding fails, use the content as-is (for playground text)
        data = file.content as string;
      }
      
      // Extract just the filename from the full path (file.name already includes path)
      const fileName = file.name.split('/').pop() || file.name;
      // Put main files in src directory for proper Noir project structure
      const filePath = fileName === 'main.nr' ? `src/${fileName}` : `./${fileName}`;
      
      console.log(`Writing file: ${filePath} with content:`, data.substring(0, 100) + "...");
      
      // Write file with correct path structure
      await fm.writeFile(filePath, stringToStream(data));
    }

    console.log("Starting Noir compilation...");
    const compiled = await compile(fm, "/");
    
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
}: {
  circuit: CompiledCircuit;
  input: InputMap;
}) {
  try {
    console.log("Creating backend and Noir instance...");
    // Use working BarretenbergBackend with beta.6 compatibility
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit);
    
    console.log("Backend and Noir instance created successfully");

    console.log("Executing circuit with inputs:", input);
    // Format inputs properly - ensure they're the right type
    const formattedInput = Object.entries(input).reduce((acc, [key, value]) => {
      // Convert string inputs to numbers if they're numeric
      const numValue = typeof value === 'string' ? (isNaN(Number(value)) ? value : Number(value)) : value;
      acc[key] = numValue;
      return acc;
    }, {} as InputMap);
    
    console.log("Formatted inputs:", formattedInput);
    
    // Validate that all required inputs are provided
    if (Object.keys(formattedInput).length === 0) {
      throw new Error("No inputs provided. Please provide values for all circuit parameters.");
    }
    
    // Follow tutorial pattern exactly: execute to get witness, then generate proof
    console.log("Executing circuit to generate witness...");
    try {
      const { witness } = await noir.execute(formattedInput);
      console.log("Witness generated successfully, generating proof...");
      
      const proof = await backend.generateProof(witness);
      console.log("Proof generation successful");
      return proof;
    } catch (proofError) {
      console.error("Proof generation failed:", proofError);
      throw new Error(`Proof generation failed: ${proofError}`);
    }
  } catch (error) {
    console.error("Proof generation error:", error);
    
    if (error instanceof Error) {
      let message = error.message;
      
      // Add helpful tips for common proof generation errors
      if (message.includes("Cannot satisfy constraint")) {
        message = "Circuit constraint failed during witness generation. An assertion in your code is not satisfied with the provided inputs.";
        message += "\n\nTip: Check that your assertions are satisfied with the input values. For example, if you have 'assert(x != y)', make sure x and y are actually different.";
      } else if (message.includes("unreachable")) {
        message = "Backend error during proof generation. This can happen due to constraint violations or backend issues.";
        message += "\n\nTip: Try different input values, reduce circuit complexity, or check for constraint violations.";
      } else if (message.includes("execution error") || message.includes("constraint")) {
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
}: {
  circuit: CompiledCircuit;
  proof: Uint8Array;
  publicInputs: string[];
}) {
  try {
    console.log("Initializing backend and verifier...");
    // Use working BarretenbergBackend with beta.6 compatibility
    const backend = new BarretenbergBackend(circuit);
    const verifier = new BarretenbergVerifier();
    
    console.log("Getting verification key...");
    const verificationKey = await backend.getVerificationKey();
    
    console.log("Verifying proof...");
    // Use the working verifier pattern
    const proofData = {
      proof,
      publicInputs
    };
    const isValid = await verifier.verifyProof(proofData, verificationKey);

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
