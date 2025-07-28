# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noirlings.app is an interactive learning platform for the Noir programming language built with React, TypeScript, and Vite. It's a monorepo using Yarn workspaces with the main application in `packages/noirlings/`.

## Common Commands

### Development
```bash
yarn dev                    # Start development server with exercise generation
yarn dev-no-exercises      # Start development server without exercise generation
yarn build                 # Production build with memory optimization
yarn vercel-build          # Optimized build for Vercel deployment
yarn generate-exercises    # Generate exercise JSON files from Markdown
```

### Noirlings Package Commands
```bash
cd packages/noirlings
yarn dev                   # Vite development server only
yarn build                 # TypeScript compilation + Vite build (uses 8GB memory)
yarn build:vercel          # Optimized build for Vercel deployment
yarn preview               # Preview production build
yarn server                # Start Express server
yarn publish               # Build and publish package
```

### Code Quality
```bash
# ESLint is configured but no direct lint script - run via:
npx eslint src/           # Lint TypeScript/React code in noirlings package
tsc --noEmit              # TypeScript type checking
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
- **`packages/noirlings/src/components/`**: React UI components organized by feature
  - `editor/`: Monaco-based Noir code editor with custom language support
  - `exercisesSidebar/` & `advancedExercisesSidebar/`: Exercise navigation
- **`packages/noirlings/src/hooks/`**: Custom hooks for auth (Supabase), Monaco integration, theming
- **`packages/noirlings/src/utils/`**: Exercise loading, proof generation, file system utilities
- **`packages/noirlings/public/exercises/`**: Exercise content as Markdown files with frontmatter
  - `basic/`: Fundamental Noir concepts
  - `advanced/`: Complex topics (hashes, merkle trees, privacy, ethereum)

### Technology Stack
- React 18 + TypeScript + Vite
- Monaco Editor with custom Noir language definitions
- Tailwind CSS with custom design system (custom color palette)
- Supabase for authentication
- Vercel for deployment and analytics
- Noir compiler: `@noir-lang/noir_wasm`, `@noir-lang/noir_js` v1.0.0-beta.6
- Node polyfills via `vite-plugin-node-polyfills` for browser compatibility

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
Production builds use `NODE_OPTIONS=--max-old-space-size=8192` for memory allocation during TypeScript compilation and Vite bundling. This is critical for successful builds due to the large Noir WASM dependencies.

### Exercise Generation
The `scripts/generate_exercise_jsons.ts` script processes Markdown files into JSON indexes that the application consumes. This runs automatically before builds and development.

### Deployment
Optimized for Vercel with SPA routing configuration in `vercel.json`. Uses custom `vercel-build` command and outputs to `dist/` directory. The build excludes Noir dependencies from optimization due to WASM compatibility requirements.

## Development Guidelines

From `.cursor/rules/spec-coder.mdc`:
- **Plan first, then build**: Create requirements and design before coding starts

### Code Style
- ESLint configured with TypeScript, React hooks, and Prettier integration
- Custom Tailwind color system with themed colors (purple, blue, pink, orange, green, yellow, gray)
- PostCSS with autoprefixer and cssnano for production builds

## Environment Setup

Required environment variables for Supabase authentication:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous public key

Development server runs on `http://localhost:5173`.