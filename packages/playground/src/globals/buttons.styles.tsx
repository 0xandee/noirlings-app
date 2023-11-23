import styled from "styled-components";

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const InputsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

export const StyledButton = styled.button.attrs({ tabIndex: -1 })<{
  $disabled?: boolean;
  $primary?: boolean;
}>`
  margin: 10px;
  border: none;
  background-color: ${(props) => (props.$primary ? "#2B2A4C" : "#EA906C")};
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
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  width: auto;
  color: #eee2de;
`;

export const BackButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const BackButton = styled(StyledButton)`
  background-color: #b31312;
`;
