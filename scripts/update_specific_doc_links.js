const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Specific docLink mapping for each exercise
const specificDocLinks = {
    // Introduction - Getting started
    "intro/intro1": "https://noir-lang.org/docs/getting_started",

    // Variables - Mutability and declarations
    "variables/variables1": "https://noir-lang.org/docs/noir/concepts/mutability#let-bindings",
    "variables/variables2": "https://noir-lang.org/docs/noir/concepts/mutability#variable-initialization",
    "variables/variables3": "https://noir-lang.org/docs/noir/concepts/mutability#mutable-variables",
    "variables/variables4": "https://noir-lang.org/docs/noir/concepts/mutability#variable-scope",
    "variables/variables5": "https://noir-lang.org/docs/noir/concepts/shadowing",
    "variables/variables6": "https://noir-lang.org/docs/noir/concepts/mutability#constants",

    // Fields - Finite field arithmetic
    "fields/field1": "https://noir-lang.org/docs/noir/concepts/data_types/fields#field-arithmetic",

    // Integers - Integer types and operations
    "integers/integer1": "https://noir-lang.org/docs/noir/concepts/data_types/integers#wrapping-methods",
    "integers/integer2": "https://noir-lang.org/docs/noir/concepts/data_types/integers#signed-integers",

    // Arrays - Array operations and methods
    "arrays/array_basics": "https://noir-lang.org/docs/noir/concepts/data_types/arrays#array-initialization",
    "arrays/array_advance": "https://noir-lang.org/docs/noir/concepts/data_types/arrays#array-methods",

    // Control Flow - Conditionals and loops
    "control-flow/if1": "https://noir-lang.org/docs/noir/concepts/control_flow#if-expressions",
    "control-flow/grade_calculator": "https://noir-lang.org/docs/noir/concepts/control_flow#conditional-expressions",
    "control-flow/count_factors": "https://noir-lang.org/docs/noir/concepts/control_flow#for-loops",

    // Structs - Data structures
    "structs/structs1": "https://noir-lang.org/docs/noir/concepts/data_types/structs#struct-definition",
    "structs/structs2": "https://noir-lang.org/docs/noir/concepts/data_types/structs#implementation-blocks",
    "structs/structs3": "https://noir-lang.org/docs/noir/concepts/data_types/structs#nested-structs",
    "structs/shopping_cart": "https://noir-lang.org/docs/noir/concepts/data_types/structs#methods",

    // Traits - Trait system
    "traits/traits1": "https://noir-lang.org/docs/noir/standard_library/traits#implementing-traits",
    "traits/traits2": "https://noir-lang.org/docs/noir/standard_library/traits#multiple-trait-implementations",
    "traits/traits3": "https://noir-lang.org/docs/noir/concepts/generics#generic-traits",
    "traits/traits4": "https://noir-lang.org/docs/noir/standard_library/traits#default-implementations",
    "traits/traits5": "https://noir-lang.org/docs/noir/concepts/generics#trait-bounds",

    // Tuples - Tuple types
    "tuples/tuple1": "https://noir-lang.org/docs/noir/concepts/data_types/tuples#tuple-creation",
    "tuples/tuple2": "https://noir-lang.org/docs/noir/concepts/data_types/tuples#tuple-destructuring",

    // Slices - Dynamic arrays
    "slices/slice1": "https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-creation",
    "slices/slice2": "https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-methods",
    "slices/slice3": "https://noir-lang.org/docs/noir/concepts/data_types/slices#functional-methods",
    "slices/slice4": "https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-iteration",
    "slices/slice5": "https://noir-lang.org/docs/noir/concepts/data_types/slices#slice-manipulation",

    // Strings - String handling
    "strings/string1": "https://noir-lang.org/docs/noir/concepts/data_types/strings#string-literals",
    "strings/string2": "https://noir-lang.org/docs/noir/concepts/data_types/strings#string-methods",

    // References - Reference types
    "references/reference1": "https://noir-lang.org/docs/noir/concepts/data_types/references#reference-creation",
    "references/reference2": "https://noir-lang.org/docs/noir/concepts/data_types/references#mutable-references",

    // Quizzes - General concepts
    "quizs/quiz1": "https://noir-lang.org/docs/noir/concepts/data_types/arrays#array-comparison",

    // Advanced - Cryptographic primitives
    "hashes/pedersen_hash": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes#pedersen-hash",

    // Embedded curves - Elliptic curve operations
    "embedded_curves/embedded_curve1": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#curve-points",
    "embedded_curves/embedded_curve2": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops#point-operations",
};

// Function to update docLinks in exercise files
function updateDocLinks() {
    const exercisesDir = path.join(__dirname, '../packages/playground/public/exercises');
    const basicDir = path.join(exercisesDir, 'basic');
    const advancedDir = path.join(exercisesDir, 'advanced');

    // Update basic exercises
    updateExercisesInDir(basicDir, 'basic');

    // Update advanced exercises  
    updateExercisesInDir(advancedDir, 'advanced');

    console.log('✅ DocLinks updated successfully!');
}

function updateExercisesInDir(dirPath, type) {
    const categories = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    categories.forEach(category => {
        const categoryPath = path.join(dirPath, category);
        const exercises = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.md'));

        exercises.forEach(exercise => {
            const exercisePath = path.join(categoryPath, exercise);
            const exerciseKey = `${category}/${exercise.replace('.md', '')}`;

            if (specificDocLinks[exerciseKey]) {
                updateExerciseDocLink(exercisePath, specificDocLinks[exerciseKey], exerciseKey);
            }
        });
    });
}

function updateExerciseDocLink(filePath, newDocLink, exerciseKey) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);

        // Update the docLink in the frontmatter
        if (data.locales && data.locales.en) {
            data.locales.en.docLink = newDocLink;
        } else {
            // Create the structure if it doesn't exist
            data.locales = data.locales || {};
            data.locales.en = data.locales.en || {};
            data.locales.en.docLink = newDocLink;
        }

        // Reconstruct the file with updated frontmatter
        const updatedContent = matter.stringify(markdownContent, data);
        fs.writeFileSync(filePath, updatedContent);

        console.log(`✓ Updated ${exerciseKey}: ${newDocLink}`);
    } catch (error) {
        console.error(`✗ Error updating ${exerciseKey}:`, error.message);
    }
}

// Run the update
if (require.main === module) {
    updateDocLinks();
}

module.exports = { updateDocLinks, specificDocLinks }; 