import { compressSync, decompressSync, strFromU8, strToU8 } from "fflate";

import { fromUint8Array, toUint8Array, extendString } from "js-base64";
import { FileSystem } from "./fileSystem";
import { File } from "../types";

extendString();

const constructUrl = async ({
  encoded,
  baseUrl,
}: {
  encoded: string;
  baseUrl: string;
}) => {
  await navigator.clipboard.writeText(`${baseUrl}?share=${encoded}`);
};

export const shareProject = async ({
  project,
  baseUrl,
}: {
  project: FileSystem;
  baseUrl?: string;
}) => {
  const data = JSON.stringify(project.root);
  const base64 = encodeSnippet(data);
  if (baseUrl) {
    await constructUrl({ encoded: base64, baseUrl });
  }
};

export const decodeProject = (encoded: string) => {
  const compressed = toUint8Array(encoded);
  const codeBytes = decompressSync(compressed);
  const code = strFromU8(codeBytes);
  return JSON.parse(code) as File;
};

export const encodeSnippet = (code: string) => {
  const codeBytes = strToU8(code);
  const compressed = compressSync(codeBytes);
  return fromUint8Array(compressed, true);
};

export const decodeSnippet = (encoded: string) => {
  const compressed = toUint8Array(encoded);
  const codeBytes = decompressSync(compressed);
  const code = strFromU8(codeBytes);
  return code;
};
