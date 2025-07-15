import React from "react";
import { ThemeProvider } from "../hooks/useTheme";
import NoirEditor from "../components/editor/NoirEditor";

const AdvancedExercisesPage: React.FC = () => {
    return (
        <ThemeProvider>
            <NoirEditor
                baseUrl={
                    process.env.NODE_ENV === "development"
                        ? window.location.host
                        : "https://noir-playground.netlify.app"
                }
                isAdvancedMode={true}
            />
        </ThemeProvider>
    );
};

export default AdvancedExercisesPage; 