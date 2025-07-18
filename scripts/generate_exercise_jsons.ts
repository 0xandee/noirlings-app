import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Use __dirname directly instead of import.meta.url
const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');

// Define the order of exercise categories
const BASIC_CATEGORIES = [
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

const ADVANCED_CATEGORIES = ["hashes", "embedded_curves"];

// Define interface for exercises metadata
interface ExerciseMetadata {
    path: string;
    id: string;
    title: string;
    category: string;
    difficulty: string;
    tags: string[];
    mode: string;
    prerequisites: string[];
    version: string;
    locales: {
        en: {
            hint: string;
            description: string;
            docLink?: string;
        }
    }
}

// Define exercise order within categories
const exerciseOrder: Record<string, string[]> = {
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
  "quizs": ["quiz1"],
  "hashes": ["pedersen_hash"],
  "embedded_curves": ["embedded_curve1", "embedded_curve2"]
};

function generateIndexForMode(categories: string[], base: 'basic' | 'advanced') {
    let allExercises: ExerciseMetadata[] = [];
    
    // Process each category in the defined order
    categories.forEach(category => {
        const categoryDir = path.join(EXERCISES_DIR, base, category);
        if (!fs.existsSync(categoryDir)) return;
        
        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
        const categoryExercises: ExerciseMetadata[] = [];
        
        // Process each file
        files.forEach(file => {
            const mdPath = path.join(categoryDir, file);
            const content = fs.readFileSync(mdPath, 'utf8');
            const { data } = matter(content);
            const fileBase = file.replace('.md', '');
            const relativePath = `${category}/${file}`;
            const metadata: ExerciseMetadata = {
                path: relativePath,
                id: data.id || fileBase,
                title: data.title || fileBase,
                category: data.category || category,
                difficulty: data.difficulty || 'easy',
                tags: data.tags || [],
                mode: data.mode || base,
                prerequisites: data.prerequisites || [],
                version: data.version || '1.0.0',
                locales: {
                    en: {
                        hint: data.locales?.en?.hint || '',
                        description: data.locales?.en?.description || '',
                        docLink: data.locales?.en?.docLink || ''
                    }
                }
            };
            categoryExercises.push(metadata);
        });
        
        // Sort files within each category according to defined order
        if (exerciseOrder[category]) {
            categoryExercises.sort((a, b) => {
                const aIndex = exerciseOrder[category].indexOf(a.id);
                const bIndex = exerciseOrder[category].indexOf(b.id);
                
                // If both exist in the order array, sort by defined order
                if (aIndex >= 0 && bIndex >= 0) {
                    return aIndex - bIndex;
                }
                // If only one exists, prioritize the defined one
                else if (aIndex >= 0) {
                    return -1;
                }
                else if (bIndex >= 0) {
                    return 1;
                }
                // If neither exists in order array, sort alphabetically
                return a.id.localeCompare(b.id);
            });
        }
        
        // Add sorted category exercises to the overall exercises array
        allExercises = [...allExercises, ...categoryExercises];
    });
    
    const outputPath = path.join(EXERCISES_DIR, base, 'index.json');
    fs.writeFileSync(outputPath, JSON.stringify(allExercises, null, 2));
    console.log(`Generated ${outputPath}`);
}

generateIndexForMode(BASIC_CATEGORIES, 'basic');
generateIndexForMode(ADVANCED_CATEGORIES, 'advanced');

console.log('Index files generated successfully.'); 