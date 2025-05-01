import fs from 'fs';
import path from 'path';
import toml from 'toml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');
const INFO_TOML_PATH = path.join(EXERCISES_DIR, 'info.toml');

function isCategoryDir(name: string) {
    const fullPath = path.join(EXERCISES_DIR, name);
    return fs.statSync(fullPath).isDirectory();
}

function isNrFile(name: string) {
    return name.endsWith('.nr');
}

// 1. Generate categories.json
const categories = fs.readdirSync(EXERCISES_DIR).filter(isCategoryDir);
fs.writeFileSync(
    path.join(EXERCISES_DIR, 'categories.json'),
    JSON.stringify(categories, null, 2)
);

// 2. Generate <category>/exercises.json for each category
type Category = string;
categories.forEach((category: Category) => {
    const catDir = path.join(EXERCISES_DIR, category);
    const files = fs.readdirSync(catDir).filter(isNrFile);
    fs.writeFileSync(
        path.join(catDir, 'exercises.json'),
        JSON.stringify(files, null, 2)
    );
});

// 3. Generate ordered-list.json from info.toml
const infoToml = fs.readFileSync(INFO_TOML_PATH, 'utf8');
const parsed = toml.parse(infoToml);
const orderedList = (parsed.exercises || []).map((ex: any) => {
    let category = '';
    let file = '';
    if (ex.path) {
        const match = ex.path.match(/^exercises\/(.+?)\/(.+)\.nr$/);
        if (match) {
            category = match[1];
            file = match[2] + '.nr';
        }
    }
    return {
        name: ex.name,
        path: ex.path,
        mode: ex.mode,
        hint: ex.hint,
        description: ex.description,
        category,
        file,
    };
});
fs.writeFileSync(
    path.join(EXERCISES_DIR, 'ordered-list.json'),
    JSON.stringify(orderedList, null, 2)
);

console.log('Exercise JSON files generated successfully.'); 