const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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

// Function to add docLink to markdown files
function addDocLinkToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Split content into frontmatter and the rest
    const parts = content.split(/^---\r?\n/m);
    if (parts.length < 3) {
      console.error(`Invalid markdown format for ${filePath}`);
      return;
    }
    
    // Parse frontmatter
    const frontmatter = yaml.load(parts[1]);
    const category = frontmatter.category;
    
    // Check if docLink already exists in any locale
    let docLinkExists = false;
    if (frontmatter.locales && frontmatter.locales.en && frontmatter.locales.en.docLink) {
      docLinkExists = true;
    }
    
    // If category exists in docLinks and docLink doesn't already exist, add it
    if (category && docLinks[category] && !docLinkExists && frontmatter.locales && frontmatter.locales.en) {
      frontmatter.locales.en.docLink = docLinks[category];
      
      // Convert back to YAML
      const updatedFrontmatter = yaml.dump(frontmatter);
      
      // Reconstruct the file
      const updatedContent = `---\n${updatedFrontmatter}---\n${parts[2]}`;
      
      // Write back to file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated docLink in ${filePath}`);
    } else if (!category) {
      console.warn(`No category found in ${filePath}`);
    } else if (!docLinks[category]) {
      console.warn(`No docLink for category ${category} in ${filePath}`);
    } else if (docLinkExists) {
      console.log(`docLink already exists in ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

// Function to walk through directories and process markdown files
function processDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.name.endsWith('.md')) {
      addDocLinkToFile(fullPath);
    }
  }
}

// Main execution
console.log('Adding docLinks to exercise files...');
processDirectory(path.join(exercisesDir, 'basic'));
processDirectory(path.join(exercisesDir, 'advanced'));
console.log('Done!'); 