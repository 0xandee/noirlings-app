import styled from "styled-components";

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 100%;
`;

export const InputGroupBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: ${(props) =>
    props.className === "group" ? "1px solid #dadedf" : "none"};
  margin: ${(props) => (props.className === "group" ? "20px 10px" : "0 10px")};
  padding: ${(props) => (props.className === "group" ? "20px" : "")};
  max-width: 300px;
`;

export const Label = styled.label<{ $isParent?: boolean }>`
  font-size: ${(props) => (props.$isParent ? "2em" : "1em")};
`;

export const Input = styled.input<{ $color?: string }>`
  background: #fff;
  border: 1px solid #dadedf;
  border-radius: 4px;
  color: ${(props) => props.$color || "#514167"};
  font-family: inherit;
  padding: 10px;
  text-align: left;
`;
