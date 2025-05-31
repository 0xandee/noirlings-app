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
  console.log("compile");
  const fm = createFileManager("/");

  for (const file of fileSystem
    .flatten()
    .filter((item) => item.type === "file")) {
    const data = decodeSnippet(file.content as string);
    await fm.writeFile(`./${file.name}`, stringToStream(data));
  }

  const compiled = await compile(fm, "/root");
  if (!("program" in compiled)) {
    throw new Error("Invalid compilation result");
  }
  return compiled.program as CompiledCircuit;
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
  const noir = new Noir(circuit);
  const backend = new BarretenbergBackend(circuit as any, { threads });

  const { witness } = await noir.execute(input);
  const proof = await backend.generateProof(witness);

  return proof;
}
