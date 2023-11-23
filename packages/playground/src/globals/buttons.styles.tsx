import styled from "styled-components";

export const ButtonContainer = styled.div<{ column?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.column ? "column" : "row")};
  justify-content: ${(props) => (props.column ? "flex-start" : "center")};
  margin-top: 20px;
`;

export const StyledButton = styled.button<{
  fullWidth?: boolean;
  disabled?: boolean;
  primary?: boolean;
}>`
  margin: 10px;
  border: none;
  background-color: ${(props) => (props.primary ? "#2B2A4C" : "#EA906C")};
  max-height: 40px;
  text-align: right;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 15px */
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  color: #eee2de;
`;

export const BackButton = styled(StyledButton)`
  background-color: #b31312;
`;
