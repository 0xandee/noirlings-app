import { File } from "../types";
import { encodeSnippet } from "./shareSnippet";
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}
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
export const ADVANCED_CATEGORIES = [
    "hashes",
    "embedded_curves",
    "merkle_trees",
    "signatures",
    "optimization",
    "ethereum",
    "privacy",
    "recursive_proofs"
];

// Define an interface for exercise metadata
export interface ExerciseData {
    code: string;
    metadata: {
        title: string;
        description: string | null;
        hint: string | null;
        docLink: string | null;
    }
}

// Add this interface to the top where other interfaces are defined
export interface Exercise {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    tags: string[];
    mode: string;
    prerequisites: string[];
    version: string;
    path: string;
    locales: {
        en: {
            hint: string;
            description: string;
            docLink?: string;
        }
    }
}

// Define the desired order of categories
const categoryOrder = [
    "intro",
    "variables",
    "fields",
    "integers",
    "arrays",
    "control-flow",
    "structs",
    "traits",
    "tuples",
    "slices",
    "strings",
    "references",
    "quizs"
];

// Define the order of exercises within each category
const exerciseOrder = {
    "intro": ["intro1"],
    "variables": ["variables1", "variables2", "variables3", "variables4", "variables5", "variables6"],
    "fields": ["field1"],
    "integers": ["integer1", "integer2"],
    "arrays": ["array_basics", "array_advance"],
    "control-flow": ["if1", "grade_calculator", "count_factors"],
    "structs": ["structs1", "structs2", "structs3", "shopping_cart"],
    "traits": ["traits1", "traits2", "traits3", "traits4", "traits5"],
    "tuples": ["tuple1", "tuple2"],
    "slices": ["slice1", "slice2", "slice3", "slice4", "slice5"],
    "strings": ["string1", "string2"],
    "references": ["reference1", "reference2"],
    "quizs": ["quiz1"]
};

export async function getOrderedExercises() {
    // Fetch the exercises from the index file
    const response = await fetch('/exercises/basic/index.json');
    if (!response.ok) throw new Error('Failed to fetch basic index');
    const exercises: Exercise[] = await response.json();

    // Sort exercises by category and then by exercise ID within category
    return exercises.sort((a: Exercise, b: Exercise) => {
        const categoryA = a.category;
        const categoryB = b.category;
        const idA = a.id;
        const idB = b.id;

        // Get category indices
        const catIndexA = categoryOrder.indexOf(categoryA);
        const catIndexB = categoryOrder.indexOf(categoryB);

        // If categories are different, sort by category order
        if (catIndexA !== catIndexB) {
            // If category is not found in the order, place it at the end
            if (catIndexA === -1) return 1;
            if (catIndexB === -1) return -1;
            return catIndexA - catIndexB;
        }

        // If categories are the same, sort by exercise order within the category
        if (categoryA in exerciseOrder) {
            const exIndexA = exerciseOrder[categoryA as keyof typeof exerciseOrder].indexOf(idA);
            const exIndexB = exerciseOrder[categoryA as keyof typeof exerciseOrder].indexOf(idB);

            // If both exercises are in the defined order, sort by that order
            if (exIndexA !== -1 && exIndexB !== -1) {
                return exIndexA - exIndexB;
            }
            // If only one is in the defined order, prioritize it
            if (exIndexA !== -1) return -1;
            if (exIndexB !== -1) return 1;
        }

        // Fall back to alphabetical sorting by ID
        return idA.localeCompare(idB);
    });
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

/**
 * Load both code and metadata from an exercise file
 * This new function eliminates the need for duplicated descriptions
 */
export async function loadExerciseData(exercisePath: string): Promise<ExerciseData> {
    const parts = exercisePath.split('/');
    const base = ADVANCED_CATEGORIES.includes(parts[0]) ? 'advanced' : 'basic';
    const filePath = parts.join('/');
    const response = await fetch(`/exercises/${base}/${filePath}.md`);
    if (!response.ok) throw new Error(`Failed to fetch ${exercisePath}`);

    const text = await response.text();
    const { data, content } = matter(text);

    // Extract code from the content
    const codeMatch = content.match(/```noir\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : '// No code found';

    // Extract metadata from frontmatter
    return {
        code,
        metadata: {
            title: data.title || parts[1] || '',
            description: data.locales?.en?.description || null,
            hint: data.locales?.en?.hint || null,
            docLink: data.locales?.en?.docLink || null
        }
    };
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