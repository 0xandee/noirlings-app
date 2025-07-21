const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory paths
const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');

function simplifyMarkdownStructure() {
    console.log('🔄 Simplifying markdown structure in exercise files...');

    const basicDir = path.join(EXERCISES_DIR, 'basic');
    const advancedDir = path.join(EXERCISES_DIR, 'advanced');

    // Update basic exercises
    updateExercisesInDir(basicDir, 'basic');

    // Update advanced exercises  
    updateExercisesInDir(advancedDir, 'advanced');

    console.log('✅ Markdown structure simplified successfully!');
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

            updateExerciseStructure(exercisePath, exerciseKey);
        });
    });
}

function updateExerciseStructure(filePath, exerciseKey) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);

        let updated = false;

        // Update description structure
        if (data.locales && data.locales.en && data.locales.en.description) {
            const originalDescription = data.locales.en.description;

            // Extract Key Concept content
            const keyConcept = extractKeyConcept(originalDescription);

            if (keyConcept) {
                // Create new simplified description with just the Key Concept content
                let newDescription = keyConcept.trim();

                // Change ### Docs to #### Docs
                newDescription = newDescription.replace(/### Docs/g, '#### Docs');

                // If there's no #### Docs section, add it
                if (!newDescription.includes('#### Docs')) {
                    newDescription = newDescription.trim() + '\n\n#### Docs';
                }

                if (newDescription !== originalDescription) {
                    data.locales.en.description = newDescription;
                    updated = true;
                }
            }
        }

        // Write back the file if changes were made
        if (updated) {
            const updatedContent = matter.stringify(markdownContent, data);
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✓ Updated ${exerciseKey} structure`);
        } else {
            console.log(`- No changes needed for ${exerciseKey}`);
        }

    } catch (error) {
        console.error(`✗ Error updating ${exerciseKey}:`, error.message);
    }
}

function extractKeyConcept(description) {
    // Split the description into sections
    const sections = description.split(/### /);

    // Find the Key Concept section
    for (let section of sections) {
        if (section.startsWith('Key Concept')) {
            // Extract content after "Key Concept" header, removing the header line
            const lines = section.split('\n');
            // Remove the first line (which contains "Key Concept")
            const content = lines.slice(1).join('\n').trim();
            return content;
        }
    }

    // If no Key Concept found, return the original description without headers
    return description.replace(/### [^\n]+\n/g, '').trim();
}

// Run the update
if (require.main === module) {
    simplifyMarkdownStructure();
}

module.exports = { simplifyMarkdownStructure }; 