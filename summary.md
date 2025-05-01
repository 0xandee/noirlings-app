- Removed unused variables `showTooltip`, `setShowTooltip`, `tooltipPos`, `setTooltipPos`, and the unused function `toggleExercisesSidebar` from `packages/playground/src/components/editor/NoirEditor.tsx`.
- Removed all references to these variables and function, including event handlers and commented-out tooltip JSX in the draggable separator.
- This resolves TypeScript errors TS6133 and allows the build to proceed successfully.
- Removed the unused function 'toggleExercisesSidebar' from NoirEditor.tsx to resolve a lingering TS6133 error reported by TypeScript.

# Summary of Fixes for Vercel Build Error

- Removed `@vercel/speed-insights` from `packages/playground/package.json` dependencies, as it is a Next.js-only package and not compatible with Vite/React.
- Removed the import and usage of `SpeedInsights` from `@vercel/speed-insights/next` in `packages/playground/index.tsx`.
- Left `@vercel/analytics` in place, as it is compatible with React and Vercel.

These changes resolve the build error:

```
"useParams" is not exported by "__vite-optional-peer-dep:next/navigation.js:@vercel/speed-insights", imported by "../../node_modules/@vercel/speed-insights/dist/next/index.mjs".
```

You can now reinstall dependencies and redeploy the app on Vercel.

- Added Open Graph and Twitter Card meta tags to `packages/playground/index.html` for rich link previews.
- Used `/public/noirlingsapp-preview-image.png` as the preview image.
- Set preview title to `NOIRLINGS.APP` and description to `Learn Noir, fast ⚡️`.
- These changes ensure that sharing the site link will display the custom image and text on social platforms and messaging apps.
