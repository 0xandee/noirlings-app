import React, { ChangeEvent, ReactNode } from "react";
import { InputsBoxTypes, ParamType } from "../../types";


export const Input = ({
  $color,
  onChange,
  ...props
}: {
  $color?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    autoComplete={props.autoComplete}
    placeholder={props.name}
    name={props.name}
    onChange={onChange}
    className={`bg-white border border-[#dadedf] rounded px-2.5 text-left ${
      $color ? `text-[${$color}]` : "text-[#514167]"
    }`}
    {...props}
  />
);

export function RenderInputs({ params, inputs, handleInput }: InputsBoxTypes) {
  if (!params) return <></>;

  return params.map((p: ParamType) => {
    function unroll(
      param: ParamType,
      parent?: string,
      rounded = "",
      firstChild = false,
    ): ReactNode {
      const componentKey = parent ? `${parent}-${param.name}` : param.name;

      if (param.children) {
        // console.log(param)  
        return (
          <>
            <legend className="block text-sm font-medium text-gray-700">{param.parent}</legend>
            {param.children.map((p: ParamType, index: number) => {
            {console.log(p)}
              // console.log(param.children!.length - 1) 
              let rounded = "";
              if (index === 0) {
                rounded = "rounded-t-md";
              } else if (index === param.children!.length - 1) {
                rounded = "rounded-b-md";
              }
              // console.log(rounded)

              return unroll(p, param.parent, rounded)
            })}
          </>
        );
      }

      return (
          <>
            {/* {console.log(param)}
            {console.log(firstChild)} */}
            {!!param.children || firstChild
              ? <legend className="block text-sm font-medium text-gray-700">
                {param.name}
              </legend> 
              : ""}
              {/* {console.log(index)} */} 
            {param.name && (
              <input
                autoComplete="off"
                type="text"
                name={param.name}
                placeholder={param.name}
                id={param.name}
                value={inputs ? inputs[p.name] : ""}
                className={`${rounded} focus:ring-indigo-500 focus:border-indigo-500 relative block w-full rounded-none bg-transparent focus:z-10 sm:text-sm border-gray-300`}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInput({ event: e, key: componentKey })
                }/>
            )}
          </>
      );
    }
    return unroll(p as ParamType, p.parent, "", true);
  });
}
