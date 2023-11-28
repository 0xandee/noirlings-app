import React, { ReactNode } from "react";

export const ResultsContainer = ({
  width,
  children,
}: {
  width?: string;
  children: ReactNode;
}) => (
  <div
    className={`flex flex-row justify-center items-start flex-wrap box-border ${
      width || "w-full"
    }`}
  >
    {children}
  </div>
);

export const ProofDataContainer = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col justify-start items-center h-full w-full bg-white m-0 my-2.5 p-5%">
    {children}
  </div>
);

export const TextProofContainer = ({ children }: { children: ReactNode }) => (
  <div className="text-center border border-gray-400 h-37.5 overflow-hidden text-gray-600 text-xs p-2">
    {children}
  </div>
);
