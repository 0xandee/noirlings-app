const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory paths
const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');

function updateMarkdownFormatting() {
    console.log('🔄 Updating markdown formatting in exercise files...');

    const basicDir = path.join(EXERCISES_DIR, 'basic');
    const advancedDir = path.join(EXERCISES_DIR, 'advanced');

    // Update basic exercises
    updateExercisesInDir(basicDir, 'basic');

    // Update advanced exercises  
    updateExercisesInDir(advancedDir, 'advanced');

    console.log('✅ Markdown formatting updated successfully!');
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

            updateExerciseFormatting(exercisePath, exerciseKey);
        });
    });
}

function updateExerciseFormatting(filePath, exerciseKey) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);

        let updated = false;

        // Update description formatting
        if (data.locales && data.locales.en && data.locales.en.description) {
            const originalDescription = data.locales.en.description;

            // Replace ## with ### in description
            let updatedDescription = originalDescription.replace(/^## /gm, '### ');

            // Add ### Docs section at the end if not already present
            if (!updatedDescription.includes('### Docs')) {
                // Remove any trailing whitespace and add the new section
                updatedDescription = updatedDescription.trim() + '\n\n### Docs';
            }

            if (updatedDescription !== originalDescription) {
                data.locales.en.description = updatedDescription;
                updated = true;
            }
        }

        // Update hint formatting to match description
        if (data.locales && data.locales.en && data.locales.en.hint) {
            const originalHint = data.locales.en.hint;

            // Replace ## with ### in hints as well for consistency
            const updatedHint = originalHint.replace(/^## /gm, '### ');

            if (updatedHint !== originalHint) {
                data.locales.en.hint = updatedHint;
                updated = true;
            }
        }

        // Write back the file if changes were made
        if (updated) {
            const updatedContent = matter.stringify(markdownContent, data);
            fs.writeFileSync(filePath, updatedContent);
            console.log(`✓ Updated ${exerciseKey} formatting`);
        } else {
            console.log(`- No changes needed for ${exerciseKey}`);
        }

    } catch (error) {
        console.error(`✗ Error updating ${exerciseKey}:`, error.message);
    }
}

// Run the update
if (require.main === module) {
    updateMarkdownFormatting();
}

module.exports = { updateMarkdownFormatting }; 