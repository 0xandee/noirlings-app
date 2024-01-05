import React from "react";
import { useState } from "react";
import { File } from "../../types";

const Directory = ({
  root,
  files,
  selectFile,
  currentPath,
}: {
  root?: string;
  files: File;
  selectFile: (file: string) => void;
  currentPath: string;
}) => {
  const [isExpanded, toggleExpanded] = useState(true);

  root = root || "";

  if (files.type === "folder") {
    return (
      <div className="w-full -ml-6">
        <div className="flex flex-col w-full pl-6">
          <p
            className="cursor-pointer font-mono"
            onClick={() => toggleExpanded(!isExpanded)}
          >
            {isExpanded ? "[-]" : "[+]"}&nbsp;{files.name}/
          </p>
          {isExpanded &&
            files.items?.map((item) => (
              <div className="pl-6" key={`${root}${item.name}`}>
                <Directory
                  root={`${root}${files.name}/`}
                  selectFile={selectFile}
                  files={item}
                  currentPath={currentPath}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full -ml-6">
      <p
        className={`font-mono m-0 p-0 cursor-pointer pl-6 ${
          currentPath === `${root}${files.name}` ? "bg-yellow-3" : ""
        }`}
        onClick={() => selectFile(`${root}${files.name}`)}
      >
        {files.name}
      </p>
    </div>
  );
};

export default Directory;
