import { CompiledCircuit } from "@noir-lang/types";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { InputMap } from "@noir-lang/noirc_abi";

<<<<<<< HEAD
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
=======
import { compile, PathToFileSourceMap } from "@noir-lang/noir_wasm";

export const compileCode = (code: string | undefined) => {
  if (!code) return;
  const sourceMap = new PathToFileSourceMap();
  sourceMap.add_source_code("main.nr", code);
  const compiled = compile("main.nr", undefined, undefined, sourceMap);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return compiled.program;
>>>>>>> origin
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
  const backend = new BarretenbergBackend(
    circuit as unknown as CompiledCircuit,
    { threads }
  );
  const noir = new Noir(circuit as unknown as CompiledCircuit, backend);
  const proof = noir!.generateProof(input);
  return proof;
}
