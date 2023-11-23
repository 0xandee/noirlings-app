import { EditorProps } from "@monaco-editor/react";
import styled from "styled-components";

export const ResultsContainer = styled.div<EditorProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  width: ${(props) => props.width || "100%"};
  align-items: flex-start;
`;

export const ProofDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: white;
  margin: 10px 0;
  padding: 5%;
  box-sizing: border-box;
`;

export const TextProofContainer = styled.div`
  text-align: center;
  border: 1px solid grey;
  height: 80px;
  color: black;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  font-size: 12px;
  color: grey;
`;
