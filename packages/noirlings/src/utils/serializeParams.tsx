import { ParamType } from "../types";

export function prepareInputs(
  params: ParamType[],
  inputs: { [key: string]: string }
) {
  const inputMap = {};
  params!.map((param) => {
    function aggregateParams(param: ParamType, parent?: string) {
      const key = parent ? `${parent}-${param.name}` : param.name;
      if (!param.children) {
        return { [param.name]: JSON.parse(inputs![key]!) };
      }
      return {
        [param.parent!]: (() => {
          const children = {};
          param.children.map((p: ParamType) =>
            Object.assign(children, aggregateParams(p, param.parent))
          );
          return children;
        })(),
      };
    }
    Object.assign(inputMap, aggregateParams(param, param.parent));
  });
  return inputMap;
}
