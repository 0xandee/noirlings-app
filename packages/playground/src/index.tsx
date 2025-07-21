import "./index.css";
import NoirEditor from "./components/editor/NoirEditor";
import React from "react";
import { PlaygroundProps } from "./types";

const NoirEditorWithTheme: React.FC<PlaygroundProps> = (props) => (
    <NoirEditor {...props} />
);

export default NoirEditorWithTheme; 