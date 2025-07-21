import React from "react";
import NoirEditor from "../components/editor/NoirEditor";

const AdvancedExercisesPage: React.FC = () => {
    return (
        <NoirEditor
            baseUrl={
                process.env.NODE_ENV === "development"
                    ? window.location.host
                    : "https://noir-playground.netlify.app"
            }
            isAdvancedMode={true}
        />
    );
};

export default AdvancedExercisesPage; 