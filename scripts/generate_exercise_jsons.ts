import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');

const BASIC_CATEGORIES = ["intro", "fields", "integers", "arrays", "control-flow", "structs", "traits", "variables", "tuples", "slices", "strings", "references", "merkle-tree", "quizs"];
const ADVANCED_CATEGORIES = ["advance", "embedded_curves", "hashes"];

function generateIndexForMode(categories: string[], base: 'basic' | 'advanced') {
    const exercises = [];
    categories.forEach(category => {
        const categoryDir = path.join(EXERCISES_DIR, base, category);
        if (!fs.existsSync(categoryDir)) return;
        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
        files.forEach(file => {
            const mdPath = path.join(categoryDir, file);
            const content = fs.readFileSync(mdPath, 'utf8');
            const { data } = matter(content);
            const relativePath = `${category}/${file}`;
            const metadata = {
                path: relativePath,
                id: data.id,
                title: data.title,
                category: data.category,
                difficulty: data.difficulty,
                tags: data.tags,
                mode: data.mode,
                prerequisites: data.prerequisites,
                version: data.version,
                locales: {
                    en: {
                        hint: data.locales.en.hint,
                        description: data.locales.en.description || '',
                        docLink: data.locales.en.docLink || ''  // New
                    }
                }
            };
            exercises.push(metadata);
        });
    });
    // Sort by id or something if needed
    exercises.sort((a, b) => a.id.localeCompare(b.id));
    const outputPath = path.join(EXERCISES_DIR, base, 'index.json');
    fs.writeFileSync(outputPath, JSON.stringify(exercises, null, 2));
    console.log(`Generated ${outputPath}`);
}

generateIndexForMode(BASIC_CATEGORIES, 'basic');
generateIndexForMode(ADVANCED_CATEGORIES, 'advanced');

console.log('Index files generated successfully.'); 