import { File } from "../types";
import { encodeSnippet } from "./shareSnippet";
import matter from 'gray-matter';
// For browser, we'll assume exercises are served statically, so use fetch to list and read files.
// But since Vite serves /exercises/, we need to fetch directory listings (not standard), so perhaps pre-generate index.json during build.
// For now, hardcode or assume.
// To make it work, let's add a function to fetch all .md files recursively via fetch, but since no dir listing, pre-list them.
// Simpler: Since small number, list all known paths.
// But to scale, add a generate step to create index.json.
// For this edit, remove old code and add placeholders.
// Remove all old content except createFileFromExercise.
// Add:
export const BASIC_CATEGORIES = ["intro", "variables", "control-flow", "arrays", "structs", "references", "slices", "tuples", "strings", "integers", "traits", "fields", "quizs"];
export const ADVANCED_CATEGORIES = ["hashes", "embedded_curves"];

export async function getOrderedExercises() {
    // TODO: Implement loading basic exercises from .md files
    const response = await fetch('/exercises/basic/index.json');
    if (!response.ok) throw new Error('Failed to fetch basic index');
    return await response.json();
}

export async function getAdvancedExercises() {
    // TODO: Implement loading advanced exercises from .md files
    const response = await fetch('/exercises/advanced/index.json');
    if (!response.ok) throw new Error('Failed to fetch advanced index');
    return await response.json();
}

export async function loadExerciseContent(exercisePath: string): Promise<string> {
    // Fetch .md, parse with gray-matter, return data.code or extracted code block
    const parts = exercisePath.split('/');
    const base = ADVANCED_CATEGORIES.includes(parts[0]) ? 'advanced' : 'basic';
    const filePath = parts.join('/');
    const response = await fetch(`/exercises/${base}/${filePath}.md`);
    if (!response.ok) throw new Error(`Failed to fetch ${exercisePath}`);
    const text = await response.text();
    const { content } = matter(text);
    const codeMatch = content.match(/```noir\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : '// No code found';
}

export const createFileFromExercise = (exercisePath: string, content: string): File => {
    const parts = exercisePath.split('/');
    const exerciseName = parts[1] || "main";
    const nargoTomlContent = `
[package]
name = "${exerciseName}"
version = "0.1.0"
type = "bin"
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