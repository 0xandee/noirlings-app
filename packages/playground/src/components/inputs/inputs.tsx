import React, { ReactNode, useEffect } from "react";
import { InputsBoxTypes, ParamType } from "../../types";
import { Label, InputSection, Input, InputGroupBox } from "./inputs.styles";

export function RenderInputs({ params, inputs, handleInput }: InputsBoxTypes) {
  // Just ramming the DOM like a caveman. React people would kill me for this
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
    function unroll(
      param: ParamType,
      parent?: string,
      firstChild = false,
    ): ReactNode {
      const componentKey = parent ? `${parent}-${param.name}` : param.name;

      if (param.children) {
        return (
          <InputGroupBox className="group" key={componentKey}>
            <Label $isParent={true}>{param.parent}</Label>
            {param.children.map((p: ParamType) => unroll(p, param.parent))}
          </InputGroupBox>
        );
      }

      return (
        <InputSection $indent={!!param.children} key={componentKey}>
          <InputGroupBox className={firstChild ? "group" : ""}>
            <Label $isParent={!!param.children || firstChild}>
              {param.name}
            </Label>
            {param.name && (
              <Input
                autoComplete="off"
                name={param.name}
                type="text"
                onChange={(e) => handleInput({ event: e, key: componentKey })}
                value={inputs ? inputs[p.name] : ""}
              />
            )}
          </InputGroupBox>
        </InputSection>
      );
    }
    return unroll(p as ParamType, p.parent, true);
  });
}
