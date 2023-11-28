import React, { ReactNode } from "react";
import { EditorStyleProps } from "src/types";

export const ButtonContainer = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex flex-wrap justify-center md:justify-center">{children}</div>
);

export const BackButtonContainer = ({
  props,
  children,
}: {
  props?: EditorStyleProps;
  children?: ReactNode;
}) => (
  <div className="w-full flex justify-center" {...props}>
    {children}
  </div>
);
