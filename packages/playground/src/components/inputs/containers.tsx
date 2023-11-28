import React, { ReactNode } from "react";
import { EditorStyleProps } from "src/types";

export const InputsContainer = ({
  children,
  id,
  props,
}: {
  children: ReactNode;
  id?: string;
  props?: EditorStyleProps;
}) => (
  <div id={id} {...props}>
    {children}
  </div>
);
