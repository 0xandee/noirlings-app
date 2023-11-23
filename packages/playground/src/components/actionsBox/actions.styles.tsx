import { EditorProps } from "@monaco-editor/react";
import styled from "styled-components";

export const ActionsContainer = styled.div<EditorProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  background-color: white;
  width: ${(props) => props.width || "100%"};
`;

export const ParamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  margin: 10px;
  box-sizing: border-box;
  padding: 0 2%;
`;

export const InputsContainer = styled.div`
  width: 100%;
`;
