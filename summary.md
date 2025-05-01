# Noir Playground Codebase Overview

## Primary Purpose and Functionality

The Noir Playground is a web-based development environment for the Noir programming language. Noir is a Domain-Specific Language (DSL) for constructing privacy-preserving zero-knowledge (ZK) programs. The playground allows users to write, compile, and prove Noir code in a browser-based Monaco editor.

## Main Programming Languages and Technologies

- **TypeScript/JavaScript**: The main programming language used throughout the project
- **React**: Used for building the user interface
- **Monaco Editor**: Provides the code editing capabilities
- **Vite**: Used as the build tool
- **Noir**: The programming language the playground is built for
- **WebAssembly (WASM)**: Used to run Noir compiler and related tools in the browser
- **TailwindCSS**: Used for styling

## Code Structure and Organization

The project is organized as a monorepo using Yarn workspaces with the following packages:

1. **playground**: The core package that contains the Noir editor component
2. **website**: A demo website that showcases the playground
3. **exercises**: A collection of Noir code examples and exercises to help users learn

## Key Files and Modules

- **packages/playground/src/components/editor/NoirEditor.tsx**: The main editor component
- **packages/playground/src/utils/generateProof.tsx**: Handles compilation and proof generation
- **packages/playground/src/components/actionsBox/actions.tsx**: UI controls for compilation and proof generation
- **packages/playground/src/utils/fileSystem.tsx**: Manages the file system for projects
- **packages/playground/src/hooks/useMonaco.tsx**: Sets up the Monaco editor with Noir language support
- **packages/playground/src/components/exercisesSidebar/ExercisesSidebar.tsx**: New component to display exercises sidebar
- **packages/playground/src/utils/exerciseLoader.tsx**: Utility to load exercise content

## Architecture and Design Patterns

- **React Component-based Architecture**: The codebase follows React's component-based architecture
- **Custom Hooks**: Uses React hooks for state management and business logic
- **Monaco Editor Integration**: Deep integration with Monaco editor for syntax highlighting and code editing
- **File System Abstraction**: Custom implementation for managing files in the browser
- **WebAssembly Integration**: Uses WASM to run the Noir compiler and related tools in the browser

## Major External Dependencies

- **@noir-lang/noir_wasm**: WASM bindings for the Noir compiler
- **@noir-lang/noir_js**: JavaScript bindings for Noir
- **@noir-lang/backend_barretenberg**: Backend implementation for Noir
- **@monaco-editor/react**: React wrapper for Monaco editor
- **react-toastify**: For toast notifications
- **tailwindcss**: For UI styling
- **fflate**: For compression of shared snippets

## Coding Conventions

- TypeScript is used throughout for type safety
- React functional components with hooks for state management
- TailwindCSS for styling
- Component files use .tsx extension
- File organization by feature/component

## Testing Approach

No explicit testing framework was observed in the main package. The exercises package appears to contain some test cases for Noir programs using Noir's built-in testing capabilities.

## Where to Start Exploring

To understand the codebase better, consider exploring:

1. **packages/playground/src/components/editor/NoirEditor.tsx**: The main component that ties everything together
2. **packages/playground/src/utils/generateProof.tsx**: To understand how code compilation and proof generation work
3. **packages/exercises**: To see examples of Noir code that can be run in the playground
4. **packages/website/src/index.tsx**: To see how the playground is integrated into a website

## New Exercises Sidebar Implementation

I've implemented a new sidebar feature to display and access the exercises available in the `packages/exercises` directory:

1. Created a new **ExercisesSidebar** component (`packages/playground/src/components/exercisesSidebar/ExercisesSidebar.tsx`) that displays categories of exercises with an expandable interface.

2. Added utility functions in **exerciseLoader.tsx** to:

   - Load exercise content from the server API
   - Create a file structure from an exercise
   - Retrieve exercise categories and exercises for each category via API

3. Updated the **NoirEditor** component to:

   - Add a toggle button for showing/hiding the exercises sidebar
   - Implement a responsive layout that adjusts when the sidebar is visible
   - Handle selecting exercises and loading their content into the editor

4. The implementation allows users to:
   - Browse exercise categories (intro, fields, integers, etc.)
   - Select specific exercises to load into the editor
   - Toggle the visibility of the exercises sidebar

## API Implementation for Exercises

To serve exercise content dynamically, I've implemented a server-side API:

1. Created **API Utility Functions** (`packages/playground/src/utils/api.ts`):

   - `fetchExerciseContent`: Fetches content of a specific exercise
   - `fetchExerciseCategories`: Gets all available exercise categories
   - `fetchCategoryExercises`: Retrieves exercises for a specific category

2. Implemented **Express API Routes** (`packages/playground/src/server/api.js`):

   - `/api/exercises/categories`: Returns all exercise categories
   - `/api/exercises/categories/:category`: Returns exercises for a specific category
   - `/api/exercises/:category/:exercise`: Returns the content of a specific exercise

3. Set up an **Express Server** (`packages/playground/src/server/server.js`) to:

   - Serve the API routes
   - Handle CORS and static file serving
   - Provide a production-ready server implementation

4. Updated the **exerciseLoader.tsx** utility:

   - Modified to fetch content from the API instead of using mock data
   - Added error handling and fallback content
   - Made functions async to support API calls

5. Updated the **ExercisesSidebar** component:

   - Adapted to use async API functions
   - Added loading states and error handling
   - Improved UI to handle empty categories and loading states

6. Fixed ES modules compatibility:

   - Updated server files to use ES modules syntax (import/export) instead of CommonJS (require/module.exports)
   - Added proper handling of **dirname and **filename in ES modules context using fileURLToPath
   - Created a moduleHelper utility to simplify path resolution in ES modules
   - Updated package.json scripts to use proper Node.js flags for ES modules support
   - Added a shell script to build and start the server with proper module handling
   - Fixed TypeScript warnings about unused variables

7. Improved error handling:
   - Added proper error handling in API routes
   - Added fallback content for failed exercise loading
   - Added UI feedback for loading states and errors

This implementation enables the playground to dynamically load exercise content from the server, making it easier to maintain and update exercises without modifying the frontend code.

The Noir Playground enables developers to experiment with Noir programming language in a browser environment without requiring local installation of Noir tools. It supports code sharing, compilation, and proof generation for Noir programs.

## Debugging: Show Exercises API Error

### Problem

- When clicking "Show Exercises", the frontend tries to fetch `/api/exercises/categories` but receives HTML instead of JSON, causing a `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`.

### What has been checked

- [x] Backend defines `GET /api/exercises/categories` and returns JSON (see `api.js`).
- [x] Backend registers API routes under `/api` in `server.js`.
- [x] Frontend fetches from `${window.location.origin}/api/exercises/categories`.
- [x] If the route is not matched, the backend serves `index.html` (HTML), which causes the error.

### Most likely causes

- Backend is not running, or not running on the same port as the frontend.
- Frontend is making the request to the wrong origin (different port or protocol).
- The `/api/exercises/categories` route is not being hit due to a misconfiguration or build/deployment issue.
- There is a problem with static file serving or path resolution in the backend.

### Next steps

1. Check the browser network tab for the `/api/exercises/categories` request:
   - What is the full URL?
   - What is the response status code?
   - What is the response body?
2. Check backend server logs for errors or requests when clicking "Show Exercises".
3. Confirm backend is running and accessible at the same origin as the frontend.

---

Add the above troubleshooting steps and findings to this summary as you debug further.

## Root Cause and Solution: API Error Due to Different Ports

### Root Cause

- The frontend is running on `http://localhost:5173` (Vite dev server), while the backend API is running on `http://localhost:3000`.
- The frontend uses `window.location.origin` as the API base URL, so it tries to fetch `/api/exercises/categories` from `localhost:5173`.
- There is no API server on port 5173, so the Vite dev server serves `index.html` (HTML), not JSON, causing the `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON` error.

### Solutions

#### 1. Proxy API requests in Vite (Recommended for development)

- Configure Vite to proxy `/api` requests to `http://localhost:3000`.
- In your `vite.config.ts` or `vite.config.js`, add:
  ```js
  export default {
    // ...other config
    server: {
      proxy: {
        "/api": "http://localhost:3000",
      },
    },
  };
  ```
- Restart the Vite dev server. Now, `/api` requests from the frontend will be forwarded to the backend.

#### 2. Hardcode the API base URL (Quick test)

- In `packages/playground/src/utils/api.ts`, change:
  ```js
  const API_BASE_URL = window.location.origin;
  ```
  to
  ```js
  const API_BASE_URL = "http://localhost:3000";
  ```
- This is less flexible and not recommended for production, but will work for local testing.

### Recommendation

- Set up the Vite proxy for a seamless development experience and to avoid CORS issues.
- After making the change, test "Show Exercises" again to confirm the error is resolved.

## New Feature: ActionsBox/ResultBox Sticky at Bottom

- Made the ActionsBox/ResultBox container in `NoirEditor.tsx` sticky at the bottom of the editor area using Tailwind's `sticky` and `bottom-0` classes. This ensures the action buttons remain visible at the bottom as users scroll through the editor.

- Removed the default margin from the body in `index.css` by adding `body { margin: 0; }` to eliminate unwanted spacing around the app.

## Fixed Issue: Missing Nargo.toml Error

- Fixed an issue where compiling an exercise (e.g., intro/intro1.nr) would fail with an error about missing '/root/Nargo.toml'.
- Updated `createFileFromExercise` in `packages/playground/src/utils/exerciseLoader.tsx` to always include a minimal `Nargo.toml` at the root of the file system when loading an exercise, ensuring the Noir compiler can find the required project file.

## Fixed Issue: Unknown package type: undefined

- Fixed a compilation error ('Unknown package type: undefined') when compiling exercises by updating the generated Nargo.toml in `createFileFromExercise` to include `type = "bin"` in the `[package]` section, as required by the Noir compiler.

## New Backend Endpoint: Ordered Exercises from info.toml

- Added a new API endpoint `/api/exercises/ordered-list` in `packages/playground/src/server/api.js`.
- This endpoint parses `packages/exercises/info.toml` using the `toml` npm package and returns the ordered list of exercises as JSON, including their category and file name.
- This enables the frontend to display exercises in the sidebar in the exact order specified in `info.toml`, rather than relying on filesystem order.
- The endpoint returns an array of objects with: `name`, `path`, `mode`, `hint`, `category`, and `file` fields for each exercise.

## Frontend: Sidebar Now Uses Ordered List from info.toml

- Updated the exercise sidebar (`ExercisesSidebar.tsx`) to fetch and display exercises in the exact order specified in `info.toml`, using the new `/api/exercises/ordered-list` endpoint.
- Exercises are grouped by category but the order is preserved as in the TOML file.
- The first category is expanded by default for better UX.
- This ensures the sidebar always matches the intended learning flow and order of the repository.

## UI Enhancement: Green Text for Completed Exercises

- Updated the `ExercisesSidebar` component to display completed exercises with green text (#4CAF50).
- This provides a clear visual indicator of which exercises the user has successfully completed, in addition to the existing checkmark icon.
- The green text color helps users quickly identify which exercises they've finished in the sidebar list.

## Improved Responsiveness in NoirEditor.tsx

- Updated the main content area to use responsive flex direction (`flex-col md:flex-row`) so the sidebar and editor stack vertically on small screens and horizontally on larger screens.
- Made the sidebar take full width on mobile (`w-full md:w-1/6`) and limited its height on small screens (`max-h-60 md:max-h-none`).
- Updated the editor area to use `flex-1 flex flex-col min-h-0` for better growth/shrink behavior and responsive width.
- Changed the Monaco editor container to have a minimum height on mobile (`h-64 md:h-full min-h-0 flex-1`) to prevent overflow and ensure usability.
- Made the action/result box stack vertically on mobile and horizontally on larger screens (`flex-col md:flex-row`).
- These changes ensure the playground UI is usable and visually appealing on all device sizes.

## Troubleshooting: esbuild Architecture Error on Apple Silicon (M1/M2)

### Problem

- Error: "You installed esbuild for another platform than the one you're currently using. Specifically the '@esbuild/darwin-x64' package is present but this platform needs the '@esbuild/darwin-arm64' package instead."
- This happens when dependencies are installed under Rosetta (Intel emulation) and then run natively (ARM), or vice versa.

### Solution

1. **Delete all node_modules and lockfiles:**
   ```sh
   rm -rf node_modules
   rm -rf packages/*/node_modules
   rm -rf yarn.lock
   rm -rf package-lock.json
   rm -rf pnpm-lock.yaml
   ```
2. **Clear Yarn cache (optional but recommended):**
   ```sh
   yarn cache clean
   ```
3. **Reinstall dependencies:**
   ```sh
   yarn install
   ```
4. **Run the dev server:**
   ```sh
   yarn dev
   ```

### Make sure you are NOT running under Rosetta

- Open a new Terminal window and run `arch`. It should print `arm64` (not `i386`).
- If it prints `i386`, you are running under Rosetta. Quit Terminal and open it in native mode.

### (Optional) Support both ARM64 and x64 in Yarn

- Add to `.yarnrc.yml`:
  ```yaml
  supportedArchitectures:
    os: [darwin]
    cpu: [arm64, x64]
  ```
- Then run `yarn install` again.

### Why this happens

- esbuild is a native binary and must match your CPU architecture.
- If you install dependencies under one architecture and run under another, the wrong binary is present.

---

## New Feature: Exercises Sidebar Refactoring

- Refactored `ExercisesSidebar.tsx` to remove grouping of exercises by category.
- All exercises are now displayed in a single, flat list.
- Removed all logic and UI related to category grouping and expansion.
- The sidebar still highlights the current exercise and allows selection as before.

## 2024-06-09: Exercise Info Section and ActionsBox Placement

- Added a new section between the sidebar and the code editor in `NoirEditor.tsx` to display the current exercise's title and hint.
- Moved the `ActionsBox` from below the editor into this new section, so users see exercise info and actions together.
- Updated state in `NoirEditor` to store the current exercise's title and hint.
- Updated the `handleExerciseSelect` function and the `ExercisesSidebar` component to pass and use the exercise hint and title.
- Updated the prop types and callback signatures to ensure type safety and fix linter errors.
- The UI now clearly shows the selected exercise's title, hint, and available actions in a dedicated area, improving usability for users working through exercises.

## 2024-06-09: Sidebar Width Adjustment

- Increased the sidebar width from `md:w-1/6` to `md:w-1/4` in `NoirEditor.tsx` for better usability and readability of exercise names.
- Adjusted the exercise info section to `md:w-1/5` to maintain a visually balanced layout.

## 2024-06-09: Noir Documentation Link in Exercise Hints

- Updated the exercise hint display in `NoirEditor.tsx` to include the text: 'Check the Noir documentation at https://noir-lang.org/docs' below each hint, with the URL as a clickable link.
- This provides users with a direct reference to the official Noir documentation for further help and learning.

## Relocate Exercise Info Panel (NoirEditor)

- Refactored the main content layout in `NoirEditor.tsx` so the Exercise Info Panel and the code editor are now siblings inside a new flex row container.
- The Info Panel is always rendered (empty if no exercise is selected) for stable layout.
- The Info Panel is positioned on the left, and the code editor is on the right, side by side.
- Adjusted flex and width classes to ensure proper responsive layout.

## New Feature: Exercise Editor Visibility Fix

- Fixed an issue where the code editor was not visible if no exercise was selected. Now, the Info Panel only takes up width when an exercise is selected; otherwise, the editor uses the full available space.

## Sidebar Disappearing on Exercise Click: Root Cause Analysis

### User Question

Why does the sidebar disappear when I click on an exercise in the sidebar?

### Analysis

- There is **no code** in `NoirEditor.tsx` or `ExercisesSidebar.tsx` that hides the sidebar (`setShowExercisesSidebar(false)`) when an exercise is selected.
- The sidebar's visibility is controlled by the `showExercisesSidebar` state, which is only toggled by the "Hide Exercises" button in the top toolbar.
- **Responsive CSS classes** (e.g., `hidden md:flex`, `max-h-60 md:max-h-none`) are used for the sidebar. On small screens (mobile), these classes may hide or collapse the sidebar when the main content area (editor and info panel) is shown.
- There are **no React effects or side effects** that hide the sidebar on exercise selection.

### Conclusion

- The sidebar disappears on small screens due to responsive CSS, not because of any explicit logic tied to exercise selection.
- On wider screens, the sidebar should remain visible after selecting an exercise.
- To always show the sidebar or improve mobile UX, the responsive CSS should be adjusted or a drawer-style sidebar implemented.

## Updated Backend Endpoint: Ordered Exercises from info.toml

- Updated `packages/playground/src/server/api.js` to include the `description` field from `info.toml` in each exercise object returned by the `/api/exercises/ordered-list` endpoint. This enables the frontend to display exercise descriptions in the UI.

## New Feature: Exercise Description in Info Panel

- Updated the backend to include the `description` field for each exercise in the `/api/exercises/ordered-list` endpoint.
- Updated the `ExercisesSidebar` component and its prop types to pass the description to the `selectExercise` callback.
- Updated the `NoirEditor` component to store the current exercise's description in state, and render it above the hint in the info panel, using markdown rendering.

## Updated the description field of each [[exercises]] block in packages/exercises/info.toml.

- The new description for each exercise is now the top comment(s) from the corresponding .nr file, providing more context and clarity for each exercise.
- If a .nr file did not have a top comment, a placeholder indicating no top comment was found was used.
- All other fields (name, path, mode, hint, etc.) and formatting in info.toml were preserved.
- This improves the maintainability and clarity of the exercise metadata by ensuring the description matches the actual exercise content.

## [Date: 2024-06-09] Draggable Separator for Exercise Info Panel

- Added a draggable vertical separator between the Exercise Info Panel and the code editor in `NoirEditor.tsx`.
- Users can now drag the separator to dynamically adjust the width of the Exercise Info Panel (min 220px, max 480px).
- The layout remains responsive and visually consistent.
- Implemented with React state and mouse event handlers for smooth resizing.
- Improved the Draggable Separator UX in `NoirEditor.tsx`:
  - Added a visible handle (vertical dots) for better affordance.
  - Animated background and shadow on hover and drag for visual feedback.
  - Added a tooltip showing the current width while dragging or focusing the separator.
  - Made the separator keyboard-accessible (left/right arrows to resize) and added a focus ring for accessibility.
  - Added ARIA attributes for screen reader support.
  - Used requestAnimationFrame for smoother drag updates.

## Summary of Changes

- Implemented auto-loading and displaying of the first exercise when the user first loads the playground.
- Added a useEffect in `NoirEditor.tsx` that fetches the ordered exercises list on mount and, if no exercise is currently selected, automatically loads and displays the first exercise using the existing `handleExerciseSelect` logic.
- This ensures users are immediately presented with an exercise upon entering the playground, improving onboarding and usability.

## New Feature: Auto-load and Show Last Exercise

- Added persistence of the last selected exercise using localStorage in `NoirEditor.tsx`. Now, when the user revisits the playground, the last exercise they were working on is automatically loaded and shown. If no previous exercise is found, the first exercise is loaded as a fallback.

## New Feature: Exercise Info Panel Scrollable

- Made the Exercise Info Panel in `NoirEditor.tsx` vertically scrollable by adding `overflowY: 'auto'` and `maxHeight: '100vh'` to its style. This ensures that if the panel's content exceeds the available vertical space, a scrollbar will appear, allowing users to scroll through the content without affecting the rest of the layout.

## [UI Enhancement] Show/Hide Hint Button in NoirEditor

- Added a new 'Show/Hide Hint' button next to the 'Show/Hide Exercises' button in the top toolbar of `NoirEditor.tsx`.
- Introduced a new state variable `showHint` (default: true) to control the visibility of the exercise hint.
- The new button toggles the `showHint` state and is styled to match the existing toolbar buttons.
- The hint section in the Exercise Info Panel is now only rendered if `showHint` is true, allowing users to easily toggle hint visibility.

## [UI Enhancement] Toast Notifications Bottom Right

- Updated the `ToastContainer` in `NoirEditor.tsx` to use `position="bottom-right"`, ensuring all toast notifications (including those triggered from `actions.tsx`) appear in the bottom right corner of the screen for a more standard and unobtrusive user experience.

## Features Implemented

1. **Mark Exercise as Finished**

   - When an exercise is successfully compiled (proof is set), it is marked as finished.
   - A green check mark (✔️) is displayed next to finished exercises in the sidebar.

2. **Save User's Progress**

   - Finished exercises are persisted in localStorage under the key `noir_finished_exercises`.
   - Progress is restored on reload, so users see their completed exercises with check marks.

3. **UI/UX**
   - The sidebar visually distinguishes finished exercises with a green check mark.
   - The implementation uses a new prop (`finishedExercises`) passed from `NoirEditor` to `ExercisesSidebar`.

## Files Modified

- `NoirEditor.tsx`: Added state and logic for finished exercises, localStorage integration, and prop passing.
- `ExercisesSidebar.tsx`: Added prop for finished exercises and check mark rendering logic.

## [2024-06-09] Mark Exercise as Finished Only on Successful Compilation

- Changed the logic so that an exercise is marked as finished only when it is successfully compiled, not when a proof is set.
- Added an `onCompileSuccess` callback prop to `ActionsBox`, which is called after a successful compilation.
- `NoirEditor.tsx` now passes a handler to `ActionsBox` that adds the current exercise to the finished list when compilation succeeds.
- Removed the effect in `NoirEditor.tsx` that previously marked an exercise as finished when `proof` was set.
- This ensures that only compilation (not proof generation) marks an exercise as finished, matching the intended behavior.

## [2024-06-09] Hide Prove Button After Compile

- After a successful compile, the Prove button is no longer shown in the ActionsBox.
- The Compile button is disabled and its label changes to 'Compiled!'.
- Cleaned up linter errors by removing unused imports and variables.

## [2024-06-09] Show 'Compiling...' While Pending

- The compile button in ActionsBox now displays 'Compiling...' and is disabled while compilation is in progress.
- This provides clear feedback to the user that the compile operation is running and prevents duplicate submissions.

## [2024-06-09] Allow Re-Compile and Show Success Message

- After a successful compile, a '✨ Compiled successfully!' message is shown above the compile button.
- The user can now compile again at any time; the button is only disabled while compiling.
- This improves the UX by providing clear feedback and allowing repeated compilation without page reload.

## New Feature: Added a new `compileError` state to `ActionsBox` in `actions.tsx` to track compilation errors.

## Updated the `compile` function to set `compileError` when an error occurs, and clear it on retry or success.

## Updated the error message rendering in `ActionsBox` (actions.tsx):

- Now displays 'Error:' in bold above the error message, both in red text, for improved clarity and user experience.

## New Feature: Compile Error Cleared on Exercise Switch

- The compileError state in ActionsBox is now cleared whenever the user switches to another exercise (i.e., when the project prop changes), ensuring error messages do not persist across exercises.

## New Feature: Added ← (Back) and → (Forward) navigation buttons to the ActionsBox component in packages/playground/src/components/actionsBox/actions.tsx.

- The buttons are placed to the left and right of the Compile button, respectively, using the existing Button component for consistent styling.
- Placeholder click handlers are included for future navigation logic.

## Updated the ActionsBox navigation and compile buttons to be arranged horizontally in a single row, with ← on the left, Compile in the center, and → on the right, for improved UX and alignment with user expectations.

## New Feature: The ActionsBox component now accepts `onBack` and `onForward` props for exercise navigation, and the ←/→ buttons are wired to these callbacks. This allows the parent (e.g., NoirEditor.tsx) to control exercise navigation.

## NoirEditor now supports forward/back exercise navigation by tracking the ordered exercise list, computing the current exercise index, and passing navigation handlers to ActionsBox. The navigation buttons are disabled at the ends of the list.

## Updated `ExercisesSidebar.tsx` to right-align the checkmark (✅) for finished exercises.

- Replaced the inline-flex span with a flexbox div using `justify-content: space-between` to ensure the checkmark appears at the far right of each exercise row.
- Removed the margin from the checkmark, as spacing is now handled by flexbox.

## Moved the exercise title to the right and the Show/Hide Hint button to the left in `NoirEditor.tsx` by wrapping both elements in a flex container with `justify-between`, and placing the button before the title in the markup for improved layout and clarity.

# Dark Mode Implementation

## Overview

Added dark mode support to the Noir Playground application with a theme toggle and persistent theme preference.

## Changes Made

1. **Theme Management:**

   - Created a new `useTheme` hook with React Context to manage theme state
   - Added localStorage persistence to remember user's theme preference
   - Implemented a theme toggle button with sun/moon icons

2. **CSS Variables:**

   - Added CSS variables for light and dark themes in `index.css`
   - Colors include background, text, accent, and border colors
   - Updated components to use these CSS variables instead of hardcoded colors

3. **Components Updated:**

   - `NoirEditor`: Added theme toggle button and theme state management
   - `ExercisesSidebar`: Updated to use theme variables for UI elements
   - `ActionsBox`: Updated buttons and status messages to use theme variables
   - `ResultBox`: Updated proof output and buttons to use theme variables
   - `Button`: Added support for custom styles

4. **App Structure:**
   - Created a wrapper component in `index.tsx` to provide the theme context
   - Updated Monaco editor to use the current theme

## How to Use

The theme toggle button in the top toolbar switches between light and dark modes. The selected theme is saved to localStorage and persists between sessions.

# Noir Playground Vercel Deployment

## What was done

1. Added `vercel.json` configuration file with the following settings:

   - Set build command to use yarn build
   - Configured output directory to `packages/playground/dist`
   - Set framework to Vite
   - Added URL rewrites to support SPA routing

2. Added a `vercel-build` script to root package.json for Vercel deployment

## Deployment Instructions

To deploy this project to Vercel:

1. Push the repository to GitHub
2. Go to [Vercel](https://vercel.com) and create a new account or sign in
3. Click "New Project" and import the repository
4. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: yarn vercel-build
   - Output Directory: packages/playground/dist
5. Click "Deploy"

Vercel will automatically detect changes to your main branch and redeploy the application.

## Post-Deployment

After deploying:

- Verify that the application is working correctly
- Check routing to ensure all pages load properly
- If any issues arise, check Vercel logs for more information

## Fixed Issue: React UMD Global Reference Error

- Fixed TypeScript error in `packages/playground/src/hooks/useTheme.tsx` which was causing the build to fail with: `error TS2686: 'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.`
- Added the missing React import by changing `import { useState, useEffect, createContext, useContext } from 'react';` to `import React, { useState, useEffect, createContext, useContext } from 'react';`
- This resolves the Vercel build error and allows the project to compile successfully.

## Fixed Issue: Vercel Deployment Failure

- Fixed a build failure in Vercel deployment that was producing the error: `Could not resolve entry module "src/index.ts"`.
- The issue was in `vite.config.ts` where the entry point was incorrectly specified as `src/index.ts` instead of the actual file `src/index.tsx`.
- Updated `packages/playground/vite.config.ts` to use the correct file path: `entry: path.resolve("src/index.tsx")`.
- This ensures the Vercel build process can now find the correct entry point for the application.
