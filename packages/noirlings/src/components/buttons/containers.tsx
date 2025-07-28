import React, { ReactNode } from "react";

export const ButtonContainer = ({ children }: { children: ReactNode }) => (
  <div className="w-full flex flex-wrap">
    {children}
  </div>
);

export const BackButtonContainer = ({ children }: { children?: ReactNode }) => (
  <div className="w-full flex justify-center">{children}</div>
);
