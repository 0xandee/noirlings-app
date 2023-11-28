import { InputMap } from "@noir-lang/noirc_abi";
import { EditorProps as MonacoEditorProps } from "@monaco-editor/react";

export type ParamType = {
  name: string;
  parent?: string;
  children?: ParamType[];
};

export type InputsBoxTypes = {
  params: InputMap[] & { name: string }[];
  inputs: { [key: string]: string };
  handleInput: ({
    event,
    key,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    key: string;
  }) => void;
};

// types for the monaco editor itself
export interface EditorStyleProps {
  width?: EditorProps["width"];
  height?: EditorProps["height"];
  className?: EditorProps["className"];
}

// types related with the Editor work
export interface EditorProps extends NoirProps, MonacoEditorProps {
  baseUrl?: string;
  initialCode?: string;
}

// types related with Noir work
export interface NoirProps {
  threads?: number;
}

// all types
export interface PlaygroundProps extends NoirProps, EditorProps {}
