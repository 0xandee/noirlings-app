# Exercise File Format

This document outlines the format for creating exercise files for the Noirlings app.

## Overview

Exercise files are markdown (.md) files with frontmatter that contain Noir code examples. These files are stored in the `packages/playground/public/exercises` directory, organized by category and difficulty.

## File Structure

Each exercise file has two main parts:

1. **Frontmatter** - Metadata about the exercise enclosed between `---` delimiters
2. **Content** - The Noir code example enclosed in code blocks

## New Format (Simplified)

```markdown
---
id: example1
title: Example Exercise
category: intro
difficulty: easy
tags: []
mode: test
prerequisites: []
version: 1.0.0
locales:
  en:
    hint: A helpful hint for solving the exercise
    description: The description of the exercise that explains what to do
    docLink: https://noir-lang.org/docs/specific-section
---

```noir
// Your Noir code here
fn main() {
  // Exercise code
}
```
```

## Important Notes

- **No Duplicated Description**: The exercise description should only exist in the frontmatter under `locales.en.description`. It should not be repeated in the content section.
- **Code Block**: The content section should only contain the Noir code enclosed in a code block, without any additional text.

## Frontmatter Fields

- `id`: Unique identifier for the exercise
- `title`: Display title for the exercise
- `category`: Category the exercise belongs to (must match a valid category folder)
- `difficulty`: Difficulty level (easy, medium, hard)
- `tags`: Additional tags for filtering or organization
- `mode`: Execution mode (test, compile)
- `prerequisites`: Array of exercise IDs that should be completed first
- `version`: Version number of the exercise
- `locales.en.hint`: A helpful hint for solving the exercise (shown when hint button is clicked)
- `locales.en.description`: The full description of the exercise (displayed in the info panel)
- `locales.en.docLink`: Link to relevant documentation for this exercise

## Categories

Exercises are organized into two main sections:

1. **Basic** - Fundamental Noir concepts
   - intro
   - variables
   - control-flow
   - arrays
   - structs
   - references
   - slices
   - tuples
   - strings
   - integers
   - traits
   - fields
   - quizs

2. **Advanced** - More complex topics
   - hashes
   - embedded_curves

## How to Add a New Exercise

1. Choose the appropriate category and create a new markdown file
2. Fill in the frontmatter with all required metadata
3. Add the Noir code in a code block in the content section
4. Run the exercise generator script to update the index.json file

## Migration from Old Format

If you have exercises in the old format (with duplicated descriptions), you can use the `scripts/remove_duplicate_descriptions.js` script to update them:

```bash
node scripts/remove_duplicate_descriptions.js
```

This will remove duplicated descriptions from all exercise files and keep only the frontmatter description. 