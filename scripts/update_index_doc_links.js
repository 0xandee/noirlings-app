const fs = require('fs');
const path = require('path');

// Document links mapping from NoirEditor.tsx
const docLinks = {
  "intro": "https://noir-lang.org/docs/getting_started",
  "variables": "https://noir-lang.org/docs/dev/noir/concepts/mutability",
  "control-flow": "https://noir-lang.org/docs/dev/noir/concepts/control_flow",
  "arrays": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "structs": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "references": "https://noir-lang.org/docs/dev/noir/concepts/mutability",
  "slices": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "strings": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "tuples": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "integers": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "traits": "https://noir-lang.org/docs/dev/noir/concepts/traits",
  "fields": "https://noir-lang.org/docs/dev/noir/concepts/data_types",
  "merkle-tree": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes",
  "hashes": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/hashes",
  "embedded_curves": "https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/embedded_curve_ops",
  "quizs": "https://noir-lang.org/docs/dev/noir/concepts"
};

// Base directory for exercise files
const exercisesDir = path.join(__dirname, '../packages/playground/public/exercises');

// Function to update docLink in index.json files
function updateIndexFiles(indexPath) {
  try {
    console.log(`Updating index file: ${indexPath}`);
    const content = fs.readFileSync(indexPath, 'utf8');
    const exercises = JSON.parse(content);
    
    let updated = false;
    
    for (const exercise of exercises) {
      const category = exercise.category;
      
      if (category && docLinks[category]) {
        if (!exercise.locales) {
          exercise.locales = { en: {} };
        }
        if (!exercise.locales.en) {
          exercise.locales.en = {};
        }
        
        // Don't overwrite existing docLinks
        if (!exercise.locales.en.docLink) {
          exercise.locales.en.docLink = docLinks[category];
          updated = true;
        }
      }
    }
    
    if (updated) {
      fs.writeFileSync(indexPath, JSON.stringify(exercises, null, 2), 'utf8');
      console.log(`Updated index file: ${indexPath}`);
    } else {
      console.log(`No changes needed for: ${indexPath}`);
    }
  } catch (err) {
    console.error(`Error updating index file ${indexPath}: ${err.message}`);
  }
}

// Main execution
console.log('Updating index files with docLinks...');
updateIndexFiles(path.join(exercisesDir, 'basic/index.json'));
updateIndexFiles(path.join(exercisesDir, 'advanced/index.json'));
console.log('Done!'); 