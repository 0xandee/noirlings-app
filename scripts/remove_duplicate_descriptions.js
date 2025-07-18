const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Migration script to update exercise markdown files
 * This script removes duplicate descriptions from the content section of markdown files
 * It keeps the description in the frontmatter only
 */

// Base directory for exercise files
const exercisesDir = path.join(__dirname, '../packages/playground/public/exercises');

function migrateExerciseFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContent);
    
    // Extract the description from frontmatter
    const description = data.locales?.en?.description || '';
    if (!description) {
      console.log(`No description in frontmatter, skipping: ${filePath}`);
      return;
    }
    
    // Check if description is duplicated in the content
    // Description is usually at the beginning of the content before the code block
    const escapedDescription = description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
    const hasDescription = new RegExp(escapedDescription.trim(), 's').test(content.trim());
    
    if (!hasDescription) {
      console.log(`No duplicate description found in: ${filePath}`);
      return;
    }
    
    // Find the code block in the content
    const codeBlockMatch = content.match(/```noir[\s\S]*?```/s);
    if (!codeBlockMatch) {
      console.log(`No code block found in: ${filePath}`);
      return;
    }
    
    // Create new content with just the code block
    const newContent = `${codeBlockMatch[0]}`;
    
    // Create new file content with updated frontmatter and content
    const updatedFileContent = matter.stringify(newContent, data);
    
    // Write back to file
    fs.writeFileSync(filePath, updatedFileContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
}

// Process directories recursively
function processDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.name.endsWith('.md')) {
      migrateExerciseFile(fullPath);
    }
  }
}

// Main execution
console.log('Migrating exercise files to remove duplicate descriptions...');
processDirectory(path.join(exercisesDir, 'basic'));
processDirectory(path.join(exercisesDir, 'advanced'));
console.log('Done!'); 