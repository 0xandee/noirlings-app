#!/usr/bin/env node

/**
 * Script to validate documentation links in exercise files
 * Checks if docLinks in exercise JSON files are accessible
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to check if URL is accessible
function checkUrl(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const request = lib.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    request.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
  });
}

// Extract docLinks from JSON files
function extractDocLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const links = [];
    
    if (Array.isArray(data)) {
      data.forEach((exercise, index) => {
        if (exercise.locales && exercise.locales.en && exercise.locales.en.docLink) {
          links.push({
            exerciseId: exercise.id || `exercise-${index}`,
            docLink: exercise.locales.en.docLink,
            filePath
          });
        }
      });
    }
    
    return links;
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'red');
    return [];
  }
}

// Extract docLinks from Markdown files
function extractMarkdownDocLinks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];
    
    // Look for docLink in YAML frontmatter
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
      const yamlContent = yamlMatch[1];
      
      // Handle both simple and multiline YAML docLink formats
      // Look for docLink: followed by URL (handle >- multiline format)
      const docLinkMatch = yamlContent.match(/docLink:\s*(?:>-\s*)?\n?\s*([^\n\r]+)/);
      if (docLinkMatch) {
        const docLink = docLinkMatch[1].trim();
        // Skip invalid URLs (like >- or empty strings)
        if (docLink && docLink !== '>-' && docLink.startsWith('http')) {
          links.push({
            exerciseId: path.basename(filePath, '.md'),
            docLink: docLink,
            filePath
          });
        }
      }
    }
    
    return links;
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'red');
    return [];
  }
}

// Find all exercise files
function findExerciseFiles(dir) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.json') || item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(dir);
  return files;
}

async function main() {
  log('🔍 Starting documentation link validation...', 'blue');
  
  const exercisesDir = path.join(__dirname, '../packages/noirlings/public/exercises');
  
  if (!fs.existsSync(exercisesDir)) {
    log(`❌ Exercises directory not found: ${exercisesDir}`, 'red');
    process.exit(1);
  }
  
  const files = findExerciseFiles(exercisesDir);
  const allLinks = [];
  
  // Extract all docLinks
  for (const file of files) {
    if (file.endsWith('.json')) {
      allLinks.push(...extractDocLinks(file));
    } else if (file.endsWith('.md')) {
      allLinks.push(...extractMarkdownDocLinks(file));
    }
  }
  
  if (allLinks.length === 0) {
    log('⚠️  No documentation links found', 'yellow');
    return;
  }
  
  log(`📋 Found ${allLinks.length} documentation links to validate`, 'blue');
  
  // Check each link
  const results = [];
  for (const linkInfo of allLinks) {
    log(`Checking: ${linkInfo.docLink}`, 'blue');
    const result = await checkUrl(linkInfo.docLink);
    results.push({ ...linkInfo, ...result });
  }
  
  // Report results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  log('\n📊 VALIDATION RESULTS:', 'blue');
  log(`✅ Successful: ${successful.length}`, 'green');
  log(`❌ Failed: ${failed.length}`, failed.length > 0 ? 'red' : 'green');
  
  if (failed.length > 0) {
    log('\n🚨 FAILED LINKS:', 'red');
    failed.forEach(link => {
      log(`  ❌ ${link.exerciseId}: ${link.docLink}`, 'red');
      log(`     Status: ${link.status}`, 'red');
      if (link.error) {
        log(`     Error: ${link.error}`, 'red');
      }
      log(`     File: ${link.filePath}`, 'yellow');
      log('');
    });
  }
  
  if (successful.length > 0) {
    log('\n✅ SUCCESSFUL LINKS:', 'green');
    successful.forEach(link => {
      log(`  ✅ ${link.exerciseId}: ${link.docLink}`, 'green');
    });
  }
  
  // Exit with error code if any links failed
  process.exit(failed.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { checkUrl, extractDocLinks, extractMarkdownDocLinks };