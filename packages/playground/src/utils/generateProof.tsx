import { CompiledCircuit } from "@noir-lang/types";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { InputMap } from "@noir-lang/noirc_abi";

import { compile, PathToFileSourceMap } from "@noir-lang/noir_wasm";

export const compileCode = (code: string | undefined) => {
  if (!code) return;
  const sourceMap = new PathToFileSourceMap();
  sourceMap.add_source_code("main.nr", code);
  const compiled = compile("main.nr", undefined, undefined, sourceMap);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return compiled.program;
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
  const proof = noir!.generateFinalProof(input);
  return proof;
}
