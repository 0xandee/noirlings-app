import { EditorProps } from "@monaco-editor/react";
import styled from "styled-components";

export const ActionsContainer = styled.div<EditorProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  background-color: white;
  width: ${(props) => props.width || "100%"};
  flex-wrap: wrap;
`;

export const ParamsForm = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  padding: 0 2%;
`;

export const ButtonsForm = styled.form``;

export const InputsContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;
