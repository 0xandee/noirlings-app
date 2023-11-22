import { ReactNode, useEffect } from "react";
import { InputsBoxTypes, ParamType } from "../../types";
import { Label, InputSection, Input, InputGroupBox } from "./inputs.styles";

export function RenderInputs({ params, inputs, handleInput }: InputsBoxTypes) {
  useEffect(() => {
    const elements = document.querySelectorAll(".group");
    const container = document.getElementById("inputs-container");
    elements.forEach((el) => {
      const childElement = el;
      container?.append(childElement);
    });
  }, []);

  if (!params) return <></>;

  return params.map((p: ParamType) => {
    function unroll(param: ParamType, firstChild = false): ReactNode {
      if (param.children) {
        return (
          <InputGroupBox className="group">
            <Label $isParent={true}>{param.parent}</Label>
            {param.children.map((p: ParamType) => unroll(p))}
          </InputGroupBox>
        );
      }

      return (
        <InputSection $indent={!!param.children}>
          <InputGroupBox className={firstChild ? "group" : ""}>
            <Label $isParent={!!param.children || firstChild}>
              {param.name}
            </Label>
            {param.name && (
              <Input
                name={param.name}
                type="text"
                onChange={handleInput}
                value={inputs ? inputs[p.name] : ""}
              />
            )}
          </InputGroupBox>
        </InputSection>
      );
    }
    return unroll(p as ParamType, true);
  });
}
