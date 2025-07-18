const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory paths
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

// Define exercise order within categories
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
    "quizs": ["quiz1"],
    "hashes": ["pedersen_hash"],
    "embedded_curves": ["embedded_curve1", "embedded_curve2"]
};

function generateIndexForMode(categories, base) {
    let allExercises = [];

    // Process each category in the defined order
    categories.forEach(category => {
        const categoryDir = path.join(EXERCISES_DIR, base, category);
        if (!fs.existsSync(categoryDir)) return;

        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
        const categoryExercises = [];

        // Process each file
        files.forEach(file => {
            const mdPath = path.join(categoryDir, file);
            const content = fs.readFileSync(mdPath, 'utf8');
            const { data } = matter(content);
            const fileBase = file.replace('.md', '');
            const relativePath = `${category}/${file}`;

            const metadata = {
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

        // Sort exercises according to defined order
        if (exerciseOrder[category]) {
            categoryExercises.sort((a, b) => {
                const aIndex = exerciseOrder[category].indexOf(a.id);
                const bIndex = exerciseOrder[category].indexOf(b.id);
                return aIndex - bIndex;
            });
        }

        allExercises = allExercises.concat(categoryExercises);
    });

    return allExercises;
}

function generateExerciseJsons() {
    console.log('🔄 Generating exercise JSON files...');

    try {
        // Generate basic exercises index
        const basicExercises = generateIndexForMode(BASIC_CATEGORIES, 'basic');
        const basicIndexPath = path.join(EXERCISES_DIR, 'basic', 'index.json');
        fs.writeFileSync(basicIndexPath, JSON.stringify(basicExercises, null, 2));
        console.log(`✓ Generated ${basicIndexPath}`);

        // Generate advanced exercises index
        const advancedExercises = generateIndexForMode(ADVANCED_CATEGORIES, 'advanced');
        const advancedIndexPath = path.join(EXERCISES_DIR, 'advanced', 'index.json');
        fs.writeFileSync(advancedIndexPath, JSON.stringify(advancedExercises, null, 2));
        console.log(`✓ Generated ${advancedIndexPath}`);

        console.log('✅ Exercise JSON files generated successfully!');
        console.log(`📊 Basic exercises: ${basicExercises.length}`);
        console.log(`📊 Advanced exercises: ${advancedExercises.length}`);

    } catch (error) {
        console.error('❌ Error generating exercise JSONs:', error);
    }
}

// Run the generation
if (require.main === module) {
    generateExerciseJsons();
}

module.exports = { generateExerciseJsons }; 