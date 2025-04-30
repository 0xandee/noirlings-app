import "./index.css";
import NoirEditor from "./components/editor/NoirEditor";
import { ThemeProvider } from "./hooks/useTheme";
import React from "react";
import { PlaygroundProps } from "./types";

const NoirEditorWithTheme: React.FC<PlaygroundProps> = (props) => (
    <ThemeProvider>
        <NoirEditor {...props} />
    </ThemeProvider>
);

export default NoirEditorWithTheme; 