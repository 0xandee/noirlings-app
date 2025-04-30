import { File } from "../types";
import { encodeSnippet } from "./shareSnippet";
import { fetchCategoryExercises, fetchExerciseCategories, fetchExerciseContent, fetchOrderedExercises } from "./api";

// This is a mock implementation since we don't have direct access to the filesystem in the browser
// In a real implementation, this would fetch the exercises from a server or include them in the build

// Helper function to create a file structure from an exercise path
export const createFileFromExercise = (exercisePath: string, content: string): File => {
    const parts = exercisePath.split('/');
    const exerciseFileName = parts.pop() || "main.nr";
    const exerciseName = exerciseFileName.replace(/\.nr$/, "");

    // Minimal Nargo.toml content with required type field
    const nargoTomlContent = `
[package]
name = \"${exerciseName}\"
version = \"0.1.0\"
type = \"bin\"
`;

    return {
        name: "root",
        type: "folder",
        items: [
            {
                name: "Nargo.toml",
                type: "file",
                content: encodeSnippet(nargoTomlContent)
            },
            {
                name: "src",
                type: "folder",
                items: [
                    {
                        name: "main.nr",
                        type: "file",
                        content: encodeSnippet(content)
                    }
                ]
            }
        ]
    };
};

// Function to load exercise content from the API
export const loadExerciseContent = async (exercisePath: string): Promise<string> => {
    try {
        const parts = exercisePath.split('/');
        if (parts.length < 2) {
            throw new Error('Invalid exercise path format. Expected format: category/exercise.nr');
        }

        const category = parts[0];
        const exercise = parts[1];

        return await fetchExerciseContent(category, exercise);
    } catch (error) {
        console.error(`Error loading exercise content for ${exercisePath}:`, error);

        // Return a fallback content in case of error
        return `// Error loading exercise: ${exercisePath}
// Please check the path and try again.

fn main() {
    // Placeholder content
}`;
    }
};

// Function to get a list of all exercise categories
export const getExerciseCategories = async (): Promise<string[]> => {
    try {
        return await fetchExerciseCategories();
    } catch (error) {
        console.error('Error fetching exercise categories:', error);

        // Return a fallback list in case of error
        return [
            "intro",
            "fields",
            "integers",
            "arrays",
            "control-flow",
            "structs",
            "traits",
            "variables",
            "tuples",
            "slices",
            "strings",
            "references",
            "merkle-tree",
            "advance",
            "embedded_curves",
            "quizs"
        ];
    }
};

// Function to get exercises for a category
export const getExercisesForCategory = async (category: string): Promise<string[]> => {
    try {
        return await fetchCategoryExercises(category);
    } catch (error) {
        console.error(`Error fetching exercises for category ${category}:`, error);

        // Return an empty list in case of error
        return [];
    }
};

// Function to get the ordered list of exercises as per info.toml
export const getOrderedExercises = async (): Promise<any[]> => {
    try {
        return await fetchOrderedExercises();
    } catch (error) {
        console.error('Error fetching ordered exercises:', error);
        return [];
    }
}; 