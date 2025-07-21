# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noirlings.app is an interactive learning platform for the Noir programming language built with React, TypeScript, and Vite. It's a monorepo using Yarn workspaces with the main application in `packages/playground/`.

## Common Commands

### Development
```bash
yarn dev                    # Start development server with exercise generation
yarn build                 # Production build with memory optimization
yarn vercel-build          # Optimized build for Vercel deployment
yarn generate-exercises    # Generate exercise JSON files from Markdown
```

### Playground Package Commands
```bash
cd packages/playground
yarn dev                   # Vite development server only
yarn build                 # TypeScript compilation + Vite build
yarn preview               # Preview production build
```

### Exercise Management
```bash
yarn generate-exercises:ts # Run exercise generator script
```

## Architecture

### Monorepo Structure
- **Root**: Yarn workspace configuration and build scripts
- **`packages/playground/`**: Main React application
- **`scripts/`**: Build automation and exercise management tools

### Key Directories
- **`src/components/`**: React UI components organized by feature
  - `editor/`: Monaco-based Noir code editor with custom language support
  - `exercisesSidebar/` & `advancedExercisesSidebar/`: Exercise navigation
- **`src/hooks/`**: Custom hooks for auth (Supabase), Monaco integration, theming
- **`src/utils/`**: Exercise loading, proof generation, file system utilities
- **`public/exercises/`**: Exercise content as Markdown files with frontmatter
  - `basic/`: Fundamental Noir concepts
  - `advanced/`: Complex topics (hashes, merkle trees, privacy, ethereum)

### Technology Stack
- React 18 + TypeScript + Vite
- Monaco Editor with custom Noir language definitions
- Tailwind CSS with custom design system
- Supabase for authentication
- Vercel for deployment and analytics

## Exercise System

### Exercise Format
Exercises are Markdown files with YAML frontmatter containing:
- Metadata: id, title, category, difficulty, prerequisites
- Localized content: description, hint, documentation links
- Code: Noir examples in fenced code blocks

### Adding New Exercises
1. Create `.md` file in appropriate `public/exercises/` subdirectory
2. Follow format defined in `docs/exercise-format.md`
3. Run `yarn generate-exercises` to update index files
4. Exercises are automatically loaded and parsed at runtime

### Exercise Categories
- **Basic**: intro, variables, control-flow, arrays, structs, etc.
- **Advanced**: hashes, merkle trees, privacy, ethereum, embedded curves

## Build Process

### Memory Optimization
Production builds use `NODE_OPTIONS=--max-old-space-size=8192` for memory allocation during TypeScript compilation and Vite bundling.

### Exercise Generation
The `scripts/generate_exercise_jsons.ts` script processes Markdown files into JSON indexes that the application consumes. This runs automatically before builds and development.

### Deployment
Optimized for Vercel with SPA routing configuration in `vercel.json`.

## Development Guidelines

From `.cursor/rules/spec-coder.mdc`:
- **Plan first, then build**: Create requirements and design before coding starts

## Environment Setup

Required environment variables for Supabase authentication:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous public key

Development server runs on `http://localhost:5173`.